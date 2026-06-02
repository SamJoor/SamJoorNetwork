"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TerminalSiteNav from "@/components/TerminalSiteNav";
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
    const response = await fetch(`/api/eggs/leaderboard${qs}`, { cache: "no-store" });
    const data = await response.json();
    if (egg) setModalEntries(data.leaderboard || []);
    else setBoard(data.leaderboard || []);
  }

  const total = EGGS.length;
  const count = found.length;
  const pct = Math.round((count / total) * 100);

  return (
    <main className="site-shell min-h-screen">
      <TerminalSiteNav />
      <div className="container-page site-fit-page egg-fit-page">
        <div className="egg-fit-header">
          <div>
            <Link className="btn btn-subtle" href="/">Back to Home</Link>
            <h1>Egg Hunt</h1>
          </div>
          <div className="egg-progress">
            <div className="mb-1 text-sm">Progress: {count}/{total} ({pct}%)</div>
            <div className="h-2 overflow-hidden border border-lime-400/25 bg-black">
              <div className="h-full bg-lime-400 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="egg-fit-grid">
          <ul className="egg-card-grid">
            {EGGS.map((egg) => {
              const has = found.includes(egg.id);
              return (
                <li key={egg.id} className={`card egg-card ${has ? "egg-found" : ""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{egg.label}</div>
                    <span className="pill">{has ? "Found" : "Hidden"}</span>
                  </div>
                  <p>{egg.description}</p>
                  <button
                    className="btn btn-subtle"
                    onClick={async () => {
                      setModalEgg(egg.id);
                      await loadBoard(egg.id);
                      setModalOpen(true);
                    }}
                  >
                    View leaderboard
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="card egg-board">
            <div className="flex items-center justify-between">
              <h2>All entries</h2>
              <button className="btn btn-subtle" onClick={() => loadBoard()}>Refresh</button>
            </div>
            <ol>
              {board.length === 0 && <li className="text-sm text-zinc-600">No entries yet.</li>}
              {board.map((entry, index) => (
                <li key={`${entry.egg_id}-${entry.created_at}-${index}`}>
                  <span>{index + 1}. <b>{entry.name}</b> <span className="text-zinc-700">{entry.egg_id}</span></span>
                  <time>{new Date(entry.created_at).toLocaleString()}</time>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
            <div className="card max-w-lg w-full p-6" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Leaderboard - {modalEgg}</h3>
                <button className="btn btn-subtle" onClick={() => setModalOpen(false)}>Close</button>
              </div>
              <ol className="mt-3 max-h-[60vh] space-y-2 overflow-auto">
                {modalEntries.length === 0 && <li className="text-sm text-zinc-600">No entries yet.</li>}
                {modalEntries.map((entry, index) => (
                  <li key={`${entry.created_at}-${index}`} className="flex items-center justify-between border-b border-lime-400/20 pb-1">
                    <span>{index + 1}. <b>{entry.name}</b></span>
                    <time className="text-xs text-zinc-500">{new Date(entry.created_at).toLocaleString()}</time>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
