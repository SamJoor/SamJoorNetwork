/* app/chess/engine.worker.ts */
import { Chess } from "chess.js";

type MsgIn = {
  type: "bestmove";
  fen: string;
  timeMs: number;
  maxDepth: number;
  bookUci?: string | null;
};

type MsgOut =
  | { type: "bestmove"; uci: string | null; depthReached: number }
  | { type: "error"; message: string };

function fenKeyNoClocks(fen: string) {
  return fen.split(" ").slice(0, 4).join(" ");
}

function pieceValue(t: string) {
  switch (t) {
    case "p":
      return 100;
    case "n":
      return 320;
    case "b":
      return 330;
    case "r":
      return 500;
    case "q":
      return 900;
    default:
      return 0;
  }
}

function evalMaterial(game: Chess) {
  const board = game.board();
  let score = 0;
  for (const row of board) {
    for (const p of row) {
      if (!p) continue;
      const v = pieceValue(p.type);
      score += (p.color === "w" ? 1 : -1) * v;
    }
  }
  return score;
}

function moveToUci(m: any) {
  return `${m.from}${m.to}${m.promotion ?? ""}`;
}

/** Quiescence: only explore captures/promos at leaf. */
function quiescence(game: Chess, alpha: number, beta: number, start: number, timeMs: number) {
  if (performance.now() - start > timeMs) return evalMaterial(game);

  if (game.isCheckmate()) return game.turn() === "w" ? -999999 : 999999;
  if (game.isDraw()) return 0;

  let standPat = evalMaterial(game);

  if (game.turn() === "w") {
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;
  } else {
    if (standPat <= alpha) return alpha;
    if (beta > standPat) beta = standPat;
  }

  const moves = game.moves({ verbose: true }) as any[];
  const noisy = moves.filter((m) => m.captured || m.promotion);

  noisy.sort((a, b) => {
    const av = (a.captured ? pieceValue(a.captured) * 10 - pieceValue(a.piece) : 0) + (a.promotion ? 9000 : 0);
    const bv = (b.captured ? pieceValue(b.captured) * 10 - pieceValue(b.piece) : 0) + (b.promotion ? 9000 : 0);
    return bv - av;
  });

  if (game.turn() === "w") {
    for (const m of noisy) {
      if (performance.now() - start > timeMs) break;
      game.move(m);
      const score = quiescence(game, alpha, beta, start, timeMs);
      game.undo();
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    for (const m of noisy) {
      if (performance.now() - start > timeMs) break;
      game.move(m);
      const score = quiescence(game, alpha, beta, start, timeMs);
      game.undo();
      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

type TTEntry = { depth: number; score: number };
const TT = new Map<string, TTEntry>();
const killer = new Map<number, string[]>();
const history = new Map<string, number>();

function rememberKiller(ply: number, uci: string) {
  const arr = killer.get(ply) ?? [];
  if (arr[0] === uci) return;
  const next = [uci, arr[0]].filter(Boolean).slice(0, 2) as string[];
  killer.set(ply, next);
}

function bumpHistory(uci: string, amount: number) {
  history.set(uci, (history.get(uci) ?? 0) + amount);
}

function orderMoves(game: Chess, moves: any[], ply: number, bookUci?: string | null) {
  const k = killer.get(ply) ?? [];

  const scored = moves.map((m) => {
    const uci = moveToUci(m);
    let s = 0;

    // learned/book move gets top priority (but engine can still override tactically via search)
    if (bookUci && uci === bookUci) s += 2_000_000;

    if (k[0] === uci) s += 1_000_000;
    else if (k[1] === uci) s += 900_000;

    s += history.get(uci) ?? 0;

    if (m.promotion) s += 600_000 + pieceValue(m.promotion);

    if (m.captured) {
      const victim = pieceValue(m.captured);
      const attacker = pieceValue(m.piece);
      s += 700_000 + (victim * 10 - attacker);
    }

    return { m, s };
  });

  scored.sort((a, b) => b.s - a.s);
  return scored.map((x) => x.m);
}

function search(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  start: number,
  timeMs: number,
  bookUci?: string | null
): number {
  if (performance.now() - start > timeMs) return evalMaterial(game);

  const key = fenKeyNoClocks(game.fen());
  const tt = TT.get(key);
  if (tt && tt.depth >= depth) return tt.score;

  if (depth === 0 || game.isGameOver()) {
    const v = quiescence(game, alpha, beta, start, timeMs);
    TT.set(key, { depth, score: v });
    return v;
  }

  const moves = orderMoves(game, game.moves({ verbose: true }) as any[], ply, bookUci);

  if (game.turn() === "w") {
    let best = -Infinity;

    for (const m of moves) {
      if (performance.now() - start > timeMs) break;

      game.move(m);
      const s = search(game, depth - 1, alpha, beta, ply + 1, start, timeMs, bookUci);
      game.undo();

      if (s > best) best = s;
      if (best > alpha) alpha = best;

      if (beta <= alpha) {
        const uci = moveToUci(m);
        rememberKiller(ply, uci);
        bumpHistory(uci, 2 * depth * depth);
        break;
      }
    }

    TT.set(key, { depth, score: best });
    return best;
  } else {
    let best = Infinity;

    for (const m of moves) {
      if (performance.now() - start > timeMs) break;

      game.move(m);
      const s = search(game, depth - 1, alpha, beta, ply + 1, start, timeMs, bookUci);
      game.undo();

      if (s < best) best = s;
      if (best < beta) beta = best;

      if (beta <= alpha) {
        const uci = moveToUci(m);
        rememberKiller(ply, uci);
        bumpHistory(uci, 2 * depth * depth);
        break;
      }
    }

    TT.set(key, { depth, score: best });
    return best;
  }
}

function pickBestMove(fen: string, maxDepth: number, timeMs: number, bookUci?: string | null) {
  const game = new Chess(fen);
  const start = performance.now();

  const rootMovesRaw = game.moves({ verbose: true }) as any[];
  if (!rootMovesRaw.length) return { uci: null, depthReached: 0 };

  const maximizing = game.turn() === "w";
  let bestMove: any | null = null;
  let bestScore = maximizing ? -Infinity : Infinity;
  let depthReached = 0;

  for (let d = 1; d <= maxDepth; d++) {
    if (performance.now() - start > timeMs) break;

    const rootMoves = orderMoves(game, [...rootMovesRaw], 0, bookUci);

    let localBestMove: any | null = null;
    let localBestScore = maximizing ? -Infinity : Infinity;

    for (const m of rootMoves) {
      if (performance.now() - start > timeMs) break;

      game.move(m);
      const s = search(game, d - 1, -Infinity, Infinity, 1, start, timeMs, bookUci);
      game.undo();

      if (maximizing) {
        if (s > localBestScore) {
          localBestScore = s;
          localBestMove = m;
        }
      } else {
        if (s < localBestScore) {
          localBestScore = s;
          localBestMove = m;
        }
      }
    }

    if (localBestMove) {
      bestMove = localBestMove;
      bestScore = localBestScore;
      depthReached = d;
      bumpHistory(moveToUci(bestMove), 10 * d * d);
    }
  }

  return { uci: bestMove ? moveToUci(bestMove) : null, depthReached };
}

self.onmessage = (ev: MessageEvent<MsgIn>) => {
  try {
    const msg = ev.data;

    if (msg.type === "bestmove") {
      if (TT.size > 50_000) TT.clear();

      const { uci, depthReached } = pickBestMove(msg.fen, msg.maxDepth, msg.timeMs, msg.bookUci ?? null);
      const out: MsgOut = { type: "bestmove", uci, depthReached };
      (self as any).postMessage(out);
    }
  } catch (e: any) {
    const out: MsgOut = { type: "error", message: e?.message ?? "Worker error" };
    (self as any).postMessage(out);
  }
};
