"use client";

import { useEffect, useMemo, useState } from "react";
import { EGGS, getEggName } from "@/lib/eggs";

type Entry = {
  egg_id: string;
  name: string;
  created_at: string; // ISO timestamp
};

type Props = { onClose: () => void };

type Filter =
  | "all"         // all rows
  | "egg"         // specific egg
  | "first"       // earliest timestamps first
  | "mostFound";  // aggregate by name

export default function LeaderboardPrompt({ onClose }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedEgg, setSelectedEgg] = useState<string>(EGGS[0]?.id ?? "");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ---- fetch helpers --------------------------------------------------------
  async function fetchAll() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/eggs/leaderboard", { cache: "no-store" });
      const json = await res.json();
      const rows: unknown = Array.isArray(json) ? json : (json?.data as unknown);
      setEntries(Array.isArray(rows) ? (rows as Entry[]) : []);
    } catch {
      setErr("Failed to load leaderboard.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchByEgg(eggId: string) {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/eggs/leaderboard?egg=${encodeURIComponent(eggId)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      const rows: unknown = Array.isArray(json) ? json : (json?.data as unknown);
      setEntries(Array.isArray(rows) ? (rows as Entry[]) : []);
    } catch {
      setErr("Failed to load leaderboard for that egg.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  // initial load
  useEffect(() => {
    fetchAll();
  }, []);

  // change filter
  useEffect(() => {
    if (filter === "egg") {
      fetchByEgg(selectedEgg || EGGS[0]?.id || "");
    } else {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // egg change while in egg filter
  useEffect(() => {
    if (filter === "egg") fetchByEgg(selectedEgg || EGGS[0]?.id || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEgg]);

  // ---- computed list (typed) -----------------------------------------------
  const view = useMemo(() => {
    if (!Array.isArray(entries)) return { kind: filter, data: [] as any[] };

    switch (filter) {
      case "first": {
        const sorted = [...entries].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        return { kind: "rows" as const, data: sorted };
      }
      case "mostFound": {
        const counts: Record<string, number> = {};
        for (const e of entries) counts[e.name] = (counts[e.name] || 0) + 1;
        const rows = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        return { kind: "counts" as const, data: rows };
      }
      case "egg":
      case "all":
      default:
        return { kind: "rows" as const, data: entries };
    }
  }, [entries, filter]);

  const refresh = () => {
    if (filter === "egg") fetchByEgg(selectedEgg || EGGS[0]?.id || "");
    else fetchAll();
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="card w-full max-w-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">🥇 Leaderboard</h2>
          <div className="flex items-center gap-2">
            <button className="btn" onClick={refresh}>Refresh</button>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">View:</span>

          <button
            className={`btn ${filter === "all" ? "bg-zinc-100" : ""}`}
            onClick={() => setFilter("all")}
          >
            All entries
          </button>

          <button
            className={`btn ${filter === "first" ? "bg-zinc-100" : ""}`}
            onClick={() => setFilter("first")}
            title="Earliest timestamps first"
          >
            First overall
          </button>

          <button
            className={`btn ${filter === "mostFound" ? "bg-zinc-100" : ""}`}
            onClick={() => setFilter("mostFound")}
            title="Aggregate by person"
          >
            Most eggs found
          </button>

          <div className="inline-flex items-center gap-2">
            <button
              className={`btn ${filter === "egg" ? "bg-zinc-100" : ""}`}
              onClick={() => setFilter("egg")}
              title="Filter to a single egg"
            >
              By egg
            </button>
            <select
              className="border border-zinc-300 rounded-lg px-2 py-1 text-sm"
              value={selectedEgg}
              onChange={(e) => setSelectedEgg(e.target.value)}
              disabled={filter !== "egg"}
              aria-label="Select egg"
            >
              {EGGS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label || e.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold">
              🏆 {filter === "mostFound" ? "Top finders" : "All entries"}{" "}
              {filter === "egg" ? (
                <span className="text-zinc-500">— {getEggName(selectedEgg)}</span>
              ) : null}
            </h3>
            {loading ? (
              <span className="text-sm text-zinc-500">Loading…</span>
            ) : null}
          </div>

          {err ? (
            <div className="text-sm text-red-600">{err}</div>
          ) : view.kind === "counts" ? (
            // ---- counts branch: rows are { name, count }
            (view.data as { name: string; count: number }[]).length > 0 ? (
              <ol className="space-y-2">
                {(view.data as { name: string; count: number }[]).map((r, i) => (
                  <li key={`${r.name}-${r.count}`} className="text-sm">
                    <span className="font-semibold">{i + 1}. {r.name}</span>{" "}
                    — {r.count} {r.count === 1 ? "egg" : "eggs"}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-sm text-zinc-500">No entries yet.</div>
            )
          ) : (
            // ---- rows branch: rows are Entry[]
            (view.data as Entry[]).length > 0 ? (
              <ol className="space-y-2">
                {(view.data as Entry[]).map((e, i) => (
                  <li
                    key={`${e.egg_id}-${e.name}-${e.created_at}`}
                    className="text-sm"
                  >
                    <span className="font-semibold">{i + 1}. {e.name}</span>{" "}
                    — {getEggName(e.egg_id)}{" "}
                    <span className="text-zinc-500">
                      {new Date(e.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-sm text-zinc-500">No entries yet.</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
