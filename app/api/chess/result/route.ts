import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

type Body = {
  username: string;
  winner: "w" | "b" | "draw";
  playerColor: "w" | "b";
  difficulty?: "easy" | "medium" | "hard";
};

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
  const body = (await req.json()) as Body;

  const username = (body.username ?? "").trim();
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  const { winner, playerColor, difficulty } = body;

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
    return NextResponse.json({ error: selErr.message }, { status: 500 });
  }

  const currentElo = existing?.elo ?? 800;

  // Elo vs fixed bot rating (simple, stable)
  const botElo = 900;
  const expected = 1 / (1 + Math.pow(10, (botElo - currentElo) / 400));
  const score = isWin ? 1 : isDraw ? 0.5 : 0;

  const K = kFactor(difficulty);
  const nextElo = clampElo(currentElo + K * (score - expected));

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
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, elo: nextElo });
}
