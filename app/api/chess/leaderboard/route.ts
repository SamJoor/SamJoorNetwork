import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("chess_players")
    .select("username, elo, wins, draws, losses")
    .order("elo", { ascending: false })
    .limit(25);

  return NextResponse.json({ top: data ?? [] });
}
