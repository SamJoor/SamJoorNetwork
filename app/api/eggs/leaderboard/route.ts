import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { cleanText, rateLimit, readJson } from "@/lib/server/apiGuards";

const allowedEggIds = new Set(["Null", "Seal", "pentagon", "Code", "Teapot"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const egg = cleanText(searchParams.get("egg"), 40); // optional filter per-egg

  let q = supabaseAdmin.from("egg_events").select("egg_id,name,created_at").order("created_at", { ascending: true });
  if (egg && allowedEggIds.has(egg)) q = q.eq("egg_id", egg);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leaderboard: data });
}

export async function POST(req: Request) {
  const limited = rateLimit(req, "eggs-leaderboard", 10, 60_000);
  if (limited) return limited;

  const body = await readJson(req, 2_048) ?? {};
  const { egg_id, name } = body as { egg_id?: string; name?: string };
  const cleanedName = cleanText(name, 40);

  if (!egg_id || !allowedEggIds.has(egg_id) || !cleanedName || cleanedName.length < 2) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("egg_events")
    .insert({ egg_id, name: cleanedName });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
