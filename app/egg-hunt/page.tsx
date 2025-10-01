// app/egg-hunt/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EGGS } from "@/lib/eggs";
import { getProgress } from "@/lib/eggProgress";

type Entry = { egg_id: string; name: string; created_at: string };

export default function EggHuntPage() {
  const [found, setFound] = useState<string[]>([]);
  const [board, setBoard] = useState<Entry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEgg, setModalEgg] = useState<string | null>(null);
  const [modalEntries, setModalEntries] = useState<Entry[]>([]);

  useEffect(() => {
    (async () => setFound(await getProgress()))();
    loadBoard();
  }, []);

  async function loadBoard(egg?: string) {
    const qs = egg ? `?egg=${encodeURIComponent(egg)}` : "";
    const r = await fetch(`/api/eggs/leaderboard${qs}`, { cache: "no-store" });
    const d = await r.json();
    if (egg) setModalEntries(d.leaderboard || []);
    else setBoard(d.leaderboard || []);
  }

  const total = EGGS.length;
  const count = found.length;
  const pct = Math.round((count / total) * 100);

  return (
    <div className="container-page py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">🥚 Egg Hunt</h1>
        <Link className="btn-primary" href="/">⬅ Back to Home</Link>
      </div>

      {/* Overall progress */}
      <div>
        <div className="text-sm mb-1">Progress: {count}/{total} ({pct}%)</div>
        <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Per-egg cards */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {EGGS.map((egg) => {
          const has = found.includes(egg.id);
          return (
            <li key={egg.id} className={`card p-4 ${has ? "border-green-300 bg-green-50" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">{egg.label}</div>
                <span className={`pill ${has ? "bg-green-100 border-green-300" : ""}`}>{has ? "Found ✅" : "Hidden 🔍"}</span>
              </div>
              <p className="text-sm mt-1 text-zinc-600">{egg.description}</p>
              <div className="mt-3 h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                <div className={`h-full ${has ? "bg-green-600" : "bg-zinc-400"} transition-all`} style={{ width: has ? "100%" : "0%" }} />
              </div>
              <div className="mt-3">
                <button
                  className="btn"
                  onClick={async () => {
                    setModalEgg(egg.id);
                    await loadBoard(egg.id);
                    setModalOpen(true);
                  }}
                >
                  View leaderboard
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* All entries */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">🏆 All entries (all eggs)</h2>
          <button className="btn" onClick={() => loadBoard()}>Refresh</button>
        </div>
        <ol className="mt-3 space-y-2">
          {board.length === 0 && <li className="text-sm text-zinc-600">No entries yet.</li>}
          {board.map((e, i) => (
            <li key={`${e.egg_id}-${e.created_at}-${i}`} className="flex items-center justify-between border-b pb-1">
              <span>{i + 1}. <b>{e.name}</b> — <span className="text-zinc-700">{e.egg_id}</span></span>
              <time className="text-xs text-zinc-500">{new Date(e.created_at).toLocaleString()}</time>
            </li>
          ))}
        </ol>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="card max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Leaderboard — {modalEgg}</h3>
              <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
            </div>
            <ol className="mt-3 space-y-2 max-h-[60vh] overflow-auto">
              {modalEntries.length === 0 && <li className="text-sm text-zinc-600">No entries yet.</li>}
              {modalEntries.map((e, i) => (
                <li key={`${e.created_at}-${i}`} className="flex items-center justify-between border-b pb-1">
                  <span>{i + 1}. <b>{e.name}</b></span>
                  <time className="text-xs text-zinc-500">{new Date(e.created_at).toLocaleString()}</time>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
