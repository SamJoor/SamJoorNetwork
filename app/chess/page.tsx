"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

type Difficulty = "easy" | "medium" | "hard";
type Result = "win" | "loss" | "draw";

type WorkerOut =
  | { type: "bestmove"; uci: string | null; depthReached: number }
  | { type: "error"; message: string };

export default function ChessPage() {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [thinking, setThinking] = useState(false);
  
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [checkSquares, setCheckSquares] = useState<Record<string, any>>({});
  const [lastMoveSquares, setLastMoveSquares] = useState<Record<string, any>>({});
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlightSquares, setHighlightSquares] = useState<Record<string, any>>({});

  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [eloChange, setEloChange] = useState<number | null>(null);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const aiMoves = useRef<{ positionFen: string; uci: string }[]>([]);

  // Engine worker
  const engineRef = useRef<Worker | null>(null);
  const pendingRef = useRef<{
    resolve: (m: { uci: string | null; depthReached: number }) => void;
    reject: (e: unknown) => void;
  } | null>(null);

  /* ---------------- Helpers ---------------- */

  function clearHighlights() {
    setSelectedSquare(null);
    setHighlightSquares({});
  }

  /* ---------------- Check Highlight ---------------- */

  const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

  function findKingSquare(color: "w" | "b"): Square | null {
    const b = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.type === "k" && p.color === color) {
          const file = FILES[c];
          const rank = (8 - r).toString();
          return `${file}${rank}` as Square;
        }
      }
    }
    return null;
  }

  function updateCheckHighlight() {
    if (!game.isCheck()) {
      setCheckSquares({});
      return;
    }
    const inCheckColor = game.turn();
    const kingSq = findKingSquare(inCheckColor);
    if (!kingSq) {
      setCheckSquares({});
      return;
    }
    setCheckSquares({
      [kingSq]: { background: "rgba(255, 80, 80, 0.55)" },
    });
  }

  /* ---------------- Leaderboard ---------------- */

  async function loadLeaderboard() {
  try {
    setLeaderboardError(null);

    const res = await fetch("/api/chess/leaderboard", { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      setLeaderboard([]);
      setLeaderboardError(data?.error || "Failed to load leaderboard");
      return;
    }

    setLeaderboard(data.top || []);
  } catch (e: any) {
    setLeaderboard([]);
    setLeaderboardError(e?.message || "Failed to load leaderboard");
  }
}

  /* ---------------- Learned (Supabase book) ---------------- */

  async function getLearnedMove(fenStr: string) {
    const res = await fetch(`/api/chess/learned?fen=${encodeURIComponent(fenStr)}`);
    const data = await res.json();
    return (data.move as string | null) ?? null;
  }

  /* ---------------- Engine worker setup ---------------- */

  function ensureEngine() {
    if (engineRef.current) return;

    const w = new Worker(new URL("./engine.worker.ts", import.meta.url), { type: "module" });
    engineRef.current = w;

    w.onmessage = (ev: MessageEvent<WorkerOut>) => {
      const msg = ev.data;
      const pending = pendingRef.current;
      if (!pending) return;

      if (msg.type === "bestmove") {
        pendingRef.current = null;
        pending.resolve({ uci: msg.uci, depthReached: msg.depthReached });
        return;
      }

      if (msg.type === "error") {
        pendingRef.current = null;
        pending.reject(new Error(msg.message));
      }
    };

    w.onerror = (err) => console.error("Engine worker error:", err);
  }

  useEffect(() => {
    return () => {
      try {
        engineRef.current?.terminate();
      } catch {}
      engineRef.current = null;
      pendingRef.current = null;
    };
  }, []);

  function engineTimeMs(d: Difficulty) {
    if (d === "easy") return 120;
    if (d === "medium") return 240;
    return 420; // hard
  }

  function engineDepth(d: Difficulty) {
    if (d === "easy") return 3;
    if (d === "medium") return 5;
    return 6;
  }

  async function getEngineBestMove(fenStr: string, bookUci?: string | null) {
    ensureEngine();
    const w = engineRef.current!;
    const timeMs = engineTimeMs(difficulty);
    const maxDepth = engineDepth(difficulty);

    // cancel any pending
    if (pendingRef.current) {
      pendingRef.current.resolve({ uci: null, depthReached: 0 });
      pendingRef.current = null;
    }

    w.postMessage({
      type: "bestmove",
      fen: fenStr,
      timeMs,
      maxDepth,
      bookUci: bookUci ?? null,
    });

    return await new Promise<{ uci: string | null; depthReached: number }>((resolve, reject) => {
      pendingRef.current = { resolve, reject };
      setTimeout(() => {
        if (pendingRef.current) {
          pendingRef.current.resolve({ uci: null, depthReached: 0 });
          pendingRef.current = null;
        }
      }, timeMs + 1500);
    });
  }

  function applyUciMove(uci: string) {
    const from = uci.slice(0, 2) as Square;
    const to = uci.slice(2, 4) as Square;
    const promo = uci.length >= 5 ? uci[4] : undefined;

    try {
      return game.move({ from, to, promotion: promo ?? "q" } as any);
    } catch {
      return null;
    }
  }

  /* ---------------- AI Move ---------------- */

  async function makeAiMove() {
    setThinking(true);
    clearHighlights();

    await new Promise((r) => setTimeout(r, 250));

    const fenBefore = game.fen();

    // learned/book suggestion
    const book = await getLearnedMove(fenBefore);

    // engine search (prefers book via move ordering)
    const best = await getEngineBestMove(fenBefore, book);

    let move: any | null = null;
    if (best.uci) move = applyUciMove(best.uci);

    // fallback
    if (!move) {
      const moves = game.moves({ verbose: true }) as any[];
      if (moves.length) move = game.move(moves[Math.floor(Math.random() * moves.length)]);
    }

    if (!move) {
      setThinking(false);
      return;
    }

    aiMoves.current.push({
      positionFen: fenBefore,
      uci: `${move.from}${move.to}${move.promotion ?? ""}`,
    });

    setLastMoveSquares({
      [move.from]: { background: "rgba(255, 0, 0, 0.28)" },
      [move.to]: { background: "rgba(255, 0, 0, 0.28)" },
    });

    setFen(game.fen());
    updateCheckHighlight();
    setThinking(false);

    if (game.isGameOver()) finishGame();
  }

  /* ---------------- Player Move ---------------- */

  function makePlayerMove(from: Square, to: Square) {
    let move: any;

    try {
      move = game.move({ from, to, promotion: "q" });
    } catch {
      return false;
    }

    if (!move) return false;

    setLastMoveSquares({
      [move.from]: { background: "rgba(80, 180, 255, 0.28)" },
      [move.to]: { background: "rgba(80, 180, 255, 0.28)" },
    });

    clearHighlights();
    setFen(game.fen());
    updateCheckHighlight();

    if (game.isGameOver()) finishGame();
    else setTimeout(() => makeAiMove(), 0);

    return true;
  }

  /* ---------------- Click to Move ---------------- */

  function onSquareClick(square: Square) {
    if (thinking || gameOver) return;

    const piece = game.get(square);

    if (!selectedSquare) {
      if (!piece || piece.color !== game.turn()) return;

      const moves = game.moves({ square, verbose: true }) as any[];
      if (!moves.length) return;

      const highlights: Record<string, any> = {};
      moves.forEach((m) => {
        highlights[m.to] = {
          background: "radial-gradient(circle, #00000055 25%, transparent 26%)",
        };
      });

      highlights[square] = { background: "rgba(255,255,0,0.4)" };

      setSelectedSquare(square);
      setHighlightSquares(highlights);
      return;
    }

    if (piece && piece.color === game.turn()) {
      clearHighlights();

      const moves = game.moves({ square, verbose: true }) as any[];
      if (!moves.length) return;

      const highlights: Record<string, any> = {};
      moves.forEach((m) => {
        highlights[m.to] = {
          background: "radial-gradient(circle, #00000055 25%, transparent 26%)",
        };
      });

      highlights[square] = { background: "rgba(255,255,0,0.4)" };

      setSelectedSquare(square);
      setHighlightSquares(highlights);
      return;
    }

    const success = makePlayerMove(selectedSquare, square);
    if (!success) clearHighlights();
  }

  function onPieceDrop(from: Square, to: Square) {
    if (thinking || gameOver) return false;
    return makePlayerMove(from, to);
  }

  /* ---------------- End Game / Learning ---------------- */

  async function finishGame() {
    let winner: "w" | "b" | "draw" = "draw";
    let outcome: Result = "draw";

    if (game.isCheckmate()) {
      winner = game.turn() === "w" ? "b" : "w";
      outcome = winner === "w" ? "win" : "loss";
    } else {
      outcome = "draw";
    }

    // rating update
    const res = await fetch("/api/chess/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        winner,
        playerColor: "w",
        difficulty,
        aiMoves: aiMoves.current,
      }),
    });

    const data = await res.json();
    setEloChange(data.elo ?? null);

    // learning update (wins/draws/losses)
    await fetch("/api/chess/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outcome,
        moves: aiMoves.current,
      }),
    });

    setResult(outcome);
    setGameOver(true);
    loadLeaderboard();
  }

  function resetGame() {
    game.reset();
    aiMoves.current = [];
    setFen(game.fen());
    setGameOver(false);
    setResult(null);
    setEloChange(null);
    setLastMoveSquares({});
    clearHighlights();
    setCheckSquares({});
    updateCheckHighlight();
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 relative">
        <div className="mb-3">
  <a
    href="/"
    className="inline-block text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
  >
    ← Back 
  </a>
</div>

        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          animationDuration={300}
          customSquareStyles={{
            ...checkSquares,
            ...lastMoveSquares,
            ...highlightSquares,
          }}
          arePiecesDraggable={!thinking && !gameOver}
        />

        {thinking && !gameOver && (
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 px-4 py-2 rounded-xl text-sm font-semibold shadow">
              AI is thinking<span className="animate-pulse">…</span>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl text-center space-y-3">
              <h2 className="text-2xl font-bold">
                {result === "win" && "You Win 🎉"}
                {result === "loss" && "You Lose"}
                {result === "draw" && "Draw"}
              </h2>

              {eloChange !== null && (
                <div className="text-sm">
                  New Rating: <strong>{eloChange}</strong>
                </div>
              )}

              <div className="flex gap-3 justify-center mt-4">
                <button className="border px-4 py-2" onClick={resetGame}>
                  Play Again
                </button>
                <a href="/" className="border px-4 py-2">
                  Back to Menu
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="First + last name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="flex items-center justify-between gap-3">
          <select
            className="border p-2 w-full"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {thinking && !gameOver && (
            <span className="text-xs font-semibold text-zinc-600 whitespace-nowrap">Thinking…</span>
          )}
        </div>

        {/* LEADERBOARD */}
<div className="border rounded p-3">
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-bold">Leaderboard</h3>
    <button
      className="text-xs border px-2 py-1 rounded hover:bg-gray-100 transition"
      onClick={loadLeaderboard}
      type="button"
    >
      Refresh
    </button>
  </div>

  <ol className="text-sm space-y-2">
    {leaderboard.map((p, i) => (
      <li
        key={p.username}
        className="flex items-center justify-between gap-3"
      >
      {leaderboardError && (
  <div className="mt-2 text-xs text-red-600">
    {leaderboardError}
  </div>
)}
        <div className="truncate">
          <span className="font-medium">
            {i + 1}. {p.username}
          </span>{" "}
          <span className="text-zinc-600">— {p.elo}</span>
        </div>

        <div className="text-xs text-zinc-700 whitespace-nowrap">
          <span className="font-semibold">W</span> {p.wins ?? 0}{" "}
          <span className="font-semibold">L</span> {p.losses ?? 0}{" "}
          <span className="font-semibold">T</span> {p.draws ?? 0}
        </div>
      </li>
    ))}

    {leaderboard.length === 0 && (
      <li className="text-zinc-500 text-xs">No games recorded yet.</li>
    )}
  </ol>
</div>
      </div>
    </div>  
  );
}
