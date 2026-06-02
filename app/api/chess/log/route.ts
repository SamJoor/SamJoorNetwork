import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { isFen, isUci, rateLimit, readJson } from "@/lib/server/apiGuards";

function positionKey(fen: string) {
  return fen.split(" ").slice(0, 4).join(" ");
}

type Body = {
  outcome: "win" | "loss" | "draw"; // from PLAYER perspective in your UI
  moves: { positionFen: string; uci: string }[];
};

export async function POST(req: Request) {
  const limited = rateLimit(req, "chess-log", 8, 60_000);
  if (limited) return limited;

  const body = await readJson<Partial<Body>>(req, 24_576);
  if (!body || !["win", "loss", "draw"].includes(String(body.outcome))) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const moves = Array.isArray(body.moves)
    ? body.moves
        .filter((move) => isFen(move?.positionFen) && isUci(move?.uci))
        .slice(0, 120)
    : [];
  const playerOutcome = body.outcome as Body["outcome"];

  // Convert player outcome -> AI outcome (AI is black)
  // player win => AI loss
  // player loss => AI win
  // draw => draw
  const aiResult: "win" | "loss" | "draw" =
    playerOutcome === "win" ? "loss" : playerOutcome === "loss" ? "win" : "draw";

  for (const m of moves) {
    const key = positionKey(m.positionFen);
    const uci = m.uci;

    const { data: existing, error: selErr } = await supabaseAdmin
      .from("chess_learned_moves")
      .select("plays, wins, draws, losses")
      .eq("position_key", key)
      .eq("uci", uci)
      .maybeSingle();

    if (selErr) continue;

    if (!existing) {
      await supabaseAdmin.from("chess_learned_moves").insert({
        position_key: key,
        uci,
        plays: 1,
        wins: aiResult === "win" ? 1 : 0,
        draws: aiResult === "draw" ? 1 : 0,
        losses: aiResult === "loss" ? 1 : 0,
      });
    } else {
      await supabaseAdmin
        .from("chess_learned_moves")
        .update({
          plays: (existing.plays ?? 0) + 1,
          wins: (existing.wins ?? 0) + (aiResult === "win" ? 1 : 0),
          draws: (existing.draws ?? 0) + (aiResult === "draw" ? 1 : 0),
          losses: (existing.losses ?? 0) + (aiResult === "loss" ? 1 : 0),
        })
        .eq("position_key", key)
        .eq("uci", uci);
    }
  }

  return NextResponse.json({ ok: true });
}
