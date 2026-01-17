import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

function positionKey(fen: string) {
  return fen.split(" ").slice(0, 4).join(" ");
}

export async function GET(req: Request) {
  const fen = new URL(req.url).searchParams.get("fen");
  if (!fen) return NextResponse.json({ move: null });

  const key = positionKey(fen);

  const { data, error } = await supabaseAdmin
    .from("chess_learned_moves")
    .select("uci, plays, wins, draws, losses")
    .eq("position_key", key);

  if (error || !data || data.length === 0) {
    return NextResponse.json({ move: null });
  }

  const totalPlays = data.reduce((a, r) => a + (r.plays ?? 0), 0) || 1;
  const C = 0.9; // exploration

  let bestUci: string | null = null;
  let bestScore = -Infinity;

  for (const r of data) {
    const plays = Math.max(1, r.plays ?? 0);
    const wins = r.wins ?? 0;
    const draws = r.draws ?? 0;
    const losses = r.losses ?? 0;

    // AI reward (AI is black in your setup): win=1, draw=0.25, loss=0
    const avg = (wins + 0.25 * draws + 0 * losses) / plays;

    // UCB score = avg + exploration bonus
    const ucb = avg + C * Math.sqrt(Math.log(totalPlays + 1) / plays);

    if (ucb > bestScore) {
      bestScore = ucb;
      bestUci = r.uci;
    }
  }

  return NextResponse.json({ move: bestUci });
}
