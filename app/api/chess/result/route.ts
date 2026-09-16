import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { cleanDisplayName, rateLimit, readJson } from "@/lib/server/apiGuards";

export const dynamic = "force-dynamic";

type Body = {
  username: string;
  winner: "w" | "b" | "draw";
  playerColor: "w" | "b";
  difficulty?: "easy" | "medium" | "hard";
};

const BOT_STATE_ID = "default";
// Bot plays far more games than any single human, so its rating moves slowly
// and stays stable rather than swinging on one player's streak.
const BOT_K = 10;

function clampElo(v: number) {
  return Math.max(100, Math.round(v));
}

function kFactor(difficulty?: Body["difficulty"]) {
  // optional: harder bots move rating more (feel free to tweak)
  if (difficulty === "easy") return 16;
  if (difficulty === "hard") return 40;
  return 32;
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "chess-result", 10, 60_000);
  if (limited) return limited;

  const body = await readJson<Partial<Body>>(req, 4_096);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const username = cleanDisplayName(body.username, 40);
  if (!username) {
    return NextResponse.json(
      { error: "Username required (letters, numbers, spaces, - _ . ' only, 2-40 chars)" },
      { status: 400 }
    );
  }

  const { winner, playerColor, difficulty } = body;
  if (
    !["w", "b", "draw"].includes(String(winner)) ||
    !["w", "b"].includes(String(playerColor)) ||
    (difficulty && !["easy", "medium", "hard"].includes(difficulty))
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Player outcome
  const isDraw = winner === "draw";
  const isWin = !isDraw && winner === playerColor;
  const isLoss = !isDraw && !isWin;

  // Load existing stats (if any)
  const { data: existing, error: selErr } = await supabaseAdmin
    .from("chess_players")
    .select("username, elo, wins, losses, draws")
    .eq("username", username)
    .maybeSingle();

  if (selErr) {
    console.error("select chess_players error:", selErr);
    return NextResponse.json({ error: "Failed to load player record" }, { status: 500 });
  }

  const { data: botState, error: botSelErr } = await supabaseAdmin
    .from("chess_bot_state")
    .select("elo, wins, losses, draws, games_played")
    .eq("id", BOT_STATE_ID)
    .maybeSingle();

  if (botSelErr) {
    console.error("select chess_bot_state error:", botSelErr);
  }

  const currentElo = existing?.elo ?? 800;
  const botElo = botState?.elo ?? 900;

  const expectedPlayer = 1 / (1 + Math.pow(10, (botElo - currentElo) / 400));
  const score = isWin ? 1 : isDraw ? 0.5 : 0;

  const K = kFactor(difficulty);
  const nextElo = clampElo(currentElo + K * (score - expectedPlayer));

  const nextWins = (existing?.wins ?? 0) + (isWin ? 1 : 0);
  const nextLosses = (existing?.losses ?? 0) + (isLoss ? 1 : 0);
  const nextDraws = (existing?.draws ?? 0) + (isDraw ? 1 : 0);

  // Upsert ensures: "if played before, update same row"
  const { error: upErr } = await supabaseAdmin
    .from("chess_players")
    .upsert(
      {
        username,
        elo: nextElo,
        wins: nextWins,
        losses: nextLosses,
        draws: nextDraws,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "username" }
    );

  if (upErr) {
    console.error("upsert chess_players error:", upErr);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }

  // Bot's score/expectation is the mirror of the player's (zero-sum), moved by
  // its own smaller K so one game barely nudges it either way.
  const nextBotElo = clampElo(botElo - BOT_K * (score - expectedPlayer));
  const { error: botUpErr } = await supabaseAdmin.from("chess_bot_state").upsert(
    {
      id: BOT_STATE_ID,
      elo: nextBotElo,
      wins: (botState?.wins ?? 0) + (isLoss ? 1 : 0),
      losses: (botState?.losses ?? 0) + (isWin ? 1 : 0),
      draws: (botState?.draws ?? 0) + (isDraw ? 1 : 0),
      games_played: (botState?.games_played ?? 0) + 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (botUpErr) {
    // Non-fatal: the player's result already saved; the bot's rank just won't
    // update for this game (likely means the chess_bot_state table/row is
    // missing — see supabase/schema.sql).
    console.error("upsert chess_bot_state error:", botUpErr);
  }

  return NextResponse.json({ ok: true, elo: nextElo });
}
