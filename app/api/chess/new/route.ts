import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { cleanText, rateLimit, readJson } from "@/lib/server/apiGuards";

export async function POST(req: Request) {
  try {
    const limited = rateLimit(req, "chess-new", 12, 60_000);
    if (limited) return limited;

    const body = await readJson<Record<string, unknown>>(req, 4_096);
    if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const { player_id, player_alias, player_color, ai_level, client_meta } = body;
    const playerId = cleanText(player_id, 80);
    const playerAlias = cleanText(player_alias, 40);
    const aiLevel = cleanText(ai_level, 20) ?? "random";

    if (!playerId || !["w", "b"].includes(String(player_color)) || !["random", "easy", "medium", "hard"].includes(aiLevel)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("chess_games")
      .insert({
        player_id: playerId,
        player_alias: playerAlias,
        player_color: String(player_color),
        ai_level: aiLevel,
        client_meta: typeof client_meta === "object" && client_meta !== null ? client_meta : null,
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ game_id: data.id });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
