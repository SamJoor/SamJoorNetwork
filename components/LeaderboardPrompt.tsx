"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPrompt() {
  const [open, setOpen] = useState(false);
  const [eggId, setEggId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const onUnlock = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string };
      setEggId(detail.id);
      setName("");
      setErr(null);
      setDone(false);
      setOpen(true);
    };
    window.addEventListener("egg:unlocked", onUnlock as EventListener);
    return () => window.removeEventListener("egg:unlocked", onUnlock as EventListener);
  }, []);

  async function submit() {
    if (!eggId) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/eggs/leaderboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ egg_id: eggId, name }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(d.error || "Could not save. Try again.");
      } else {
        setDone(true);
      }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="card max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">🏆 Add yourself to the leaderboard?</h3>
        <p className="text-sm text-zinc-600 mt-1">
          You just completed <span className="font-medium">{eggId}</span>. Enter a name or alias to be listed with today’s date.
        </p>

        {done ? (
          <div className="mt-4">
            <div className="text-green-700 text-sm">Saved! Refresh the leaderboard to see your name.</div>
            <button className="btn mt-3" onClick={() => setOpen(false)}>Close</button>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-2">
              <input
                className="px-3 py-1.5 border rounded-lg text-sm w-full"
                placeholder="Your name or alias"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={40}
              />
              <button
                className="btn-primary"
                disabled={busy || name.trim().length < 2}
                onClick={submit}
              >
                {busy ? "Saving..." : "Save"}
              </button>
            </div>
            {err && <div className="text-sm text-red-600 mt-2">{err}</div>}
            <button className="btn mt-3" onClick={() => setOpen(false)}>No thanks</button>
          </>
        )}
      </div>
    </div>
  );
}
