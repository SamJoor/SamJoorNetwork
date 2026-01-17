import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { game_id, ply, san, uci, fen, move_ms } = body;

    if (!game_id || !ply || !san || !fen) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("chess_moves").insert({
      game_id,
      ply,
      san,
      uci: uci ?? null,
      fen,
      move_ms: typeof move_ms === "number" ? move_ms : null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // keep moves_count in sync
    await supabaseAdmin
      .from("chess_games")
      .update({ moves_count: ply })
      .eq("id", game_id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
