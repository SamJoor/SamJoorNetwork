import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { rateLimit } from "@/lib/server/apiGuards";
import { eloToRank } from "@/lib/chessRank";

export const dynamic = "force-dynamic";

const DEFAULT_ELO = 900;

export async function GET(req: Request) {
  const limited = rateLimit(req, "chess-bot-rank", 60, 60_000);
  if (limited) return limited;

  const { data, error } = await supabaseAdmin
    .from("chess_bot_state")
    .select("elo, wins, losses, draws, games_played")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    console.error("bot-rank fetch error:", error);
  }

  const elo = data?.elo ?? DEFAULT_ELO;

  return NextResponse.json(
    {
      elo,
      rank: eloToRank(elo),
      wins: data?.wins ?? 0,
      losses: data?.losses ?? 0,
      draws: data?.draws ?? 0,
      gamesPlayed: data?.games_played ?? 0,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
