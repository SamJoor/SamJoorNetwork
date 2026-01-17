import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { player_id, player_alias, player_color, ai_level, client_meta } = body;

    if (!player_id || !player_color) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("chess_games")
      .insert({
        player_id,
        player_alias: player_alias ?? null,
        player_color,
        ai_level: ai_level ?? "random",
        client_meta: client_meta ?? null,
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ game_id: data.id });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
