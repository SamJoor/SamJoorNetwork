import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

type Body = {
  username: string;
  winner: "w" | "b" | "draw";
  playerColor: "w" | "b";
  difficulty: "easy" | "medium" | "hard";
  aiMoves: { positionFen: string; uci: string }[];
};

function positionKey(fen: string) {
  return fen.split(" ").slice(0, 4).join(" ");
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const username = body.username?.trim();

  if (!username) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const score =
    body.winner === "draw"
      ? 0.5
      : body.winner === body.playerColor
      ? 1
      : 0;

  const { data: player } = await supabaseAdmin
    .from("chess_players")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  const elo = player?.elo ?? 800;
  const aiElo = body.difficulty === "easy" ? 800 : body.difficulty === "medium" ? 1200 : 1600;
  const expected = 1 / (1 + 10 ** ((aiElo - elo) / 400));
  const newElo = Math.round(elo + 32 * (score - expected));

  await supabaseAdmin.from("chess_players").upsert({
    username,
    elo: newElo,
    wins: (player?.wins ?? 0) + (score === 1 ? 1 : 0),
    draws: (player?.draws ?? 0) + (score === 0.5 ? 1 : 0),
    losses: (player?.losses ?? 0) + (score === 0 ? 1 : 0),
    updated_at: new Date().toISOString(),
  });

  const aiScore = score === 0.5 ? 0.5 : 1 - score;

  for (const m of body.aiMoves) {
    const key = positionKey(m.positionFen);

    const { data: row } = await supabaseAdmin
      .from("chess_learned_moves")
      .select("*")
      .eq("position_key", key)
      .eq("uci", m.uci)
      .maybeSingle();

    await supabaseAdmin.from("chess_learned_moves").upsert({
      position_key: key,
      uci: m.uci,
      plays: (row?.plays ?? 0) + 1,
      wins: (row?.wins ?? 0) + (aiScore === 1 ? 1 : 0),
      draws: (row?.draws ?? 0) + (aiScore === 0.5 ? 1 : 0),
      losses: (row?.losses ?? 0) + (aiScore === 0 ? 1 : 0),
    });
  }

  return NextResponse.json({ ok: true, elo: newElo });
}
