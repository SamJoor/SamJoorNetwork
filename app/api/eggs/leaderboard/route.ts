import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const egg = searchParams.get("egg"); // optional filter per-egg

  let q = supabaseAdmin.from("egg_events").select("egg_id,name,created_at").order("created_at", { ascending: true });
  if (egg) q = q.eq("egg_id", egg);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leaderboard: data });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { egg_id, name } = body as { egg_id?: string; name?: string };

  if (!egg_id || !name || name.trim().length < 2 || name.trim().length > 40) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("egg_events")
    .insert({ egg_id, name: name.trim() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
