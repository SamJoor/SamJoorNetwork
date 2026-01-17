import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("chess_players")
    .select("username, elo, wins, draws, losses")
    .order("elo", { ascending: false })
    .limit(25);

  if (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { top: [], error: error.message },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  return NextResponse.json(
    { top: data ?? [] },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
