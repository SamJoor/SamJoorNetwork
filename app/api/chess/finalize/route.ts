import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { game_id, result, reason, pgn, final_fen, duration_ms } = body;

    if (!game_id || !result) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("chess_games")
      .update({
        result,
        reason: reason ?? null,
        pgn: pgn ?? null,
        final_fen: final_fen ?? null,
        duration_ms: typeof duration_ms === "number" ? duration_ms : null,
      })
      .eq("id", game_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
