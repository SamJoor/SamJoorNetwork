import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { cleanText, isFen, isUuid, rateLimit, readJson } from "@/lib/server/apiGuards";

export async function POST(req: Request) {
  try {
    const limited = rateLimit(req, "chess-finalize", 20, 60_000);
    if (limited) return limited;

    const body = await readJson<Record<string, unknown>>(req, 32_768);
    if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const { game_id, result, reason, pgn, final_fen, duration_ms } = body;
    const cleanResult = cleanText(result, 20);
    const cleanReason = cleanText(reason, 80);
    const cleanPgn = typeof pgn === "string" && pgn.length <= 16_000 ? pgn : null;

    if (!isUuid(game_id) || !cleanResult || !["win", "loss", "draw", "abandoned"].includes(cleanResult)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("chess_games")
      .update({
        result: cleanResult,
        reason: cleanReason,
        pgn: cleanPgn,
        final_fen: isFen(final_fen) ? final_fen : null,
        duration_ms: typeof duration_ms === "number" ? duration_ms : null,
      })
      .eq("id", game_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
