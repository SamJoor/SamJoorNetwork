import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { cleanText, isFen, isUci, isUuid, rateLimit, readJson } from "@/lib/server/apiGuards";

export async function POST(req: Request) {
  try {
    const limited = rateLimit(req, "chess-move", 120, 60_000);
    if (limited) return limited;

    const body = await readJson<Record<string, unknown>>(req, 8_192);
    if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const { game_id, ply, san, uci, fen, move_ms } = body;
    const cleanSan = cleanText(san, 20);
    const plyNumber = typeof ply === "number" && Number.isInteger(ply) && ply > 0 && ply <= 300 ? ply : null;

    if (!isUuid(game_id) || !plyNumber || !cleanSan || !isFen(fen) || (uci && !isUci(uci))) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("chess_moves").insert({
      game_id,
      ply: plyNumber,
      san: cleanSan,
      uci: typeof uci === "string" ? uci : null,
      fen,
      move_ms: typeof move_ms === "number" ? move_ms : null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // keep moves_count in sync
    await supabaseAdmin
      .from("chess_games")
      .update({ moves_count: plyNumber })
      .eq("id", game_id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
