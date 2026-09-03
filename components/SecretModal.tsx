"use client";
import { useEffect, useState } from "react";
import { getEggName } from "@/lib/eggs";

const NAME_KEY = "egg_hunter_name";

type Status = "idle" | "saving" | "saved" | "error";

export default function SecretModal() {
  const [open, setOpen] = useState(false);
  const [eggId, setEggId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) || "");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onUnlock = (e: Event) => {
      const detail = (e as CustomEvent<{ id?: string }>).detail;
      if (!detail?.id) return;
      setEggId(detail.id);
      setStatus("idle");
      setOpen(true);
    };
    window.addEventListener("egg:unlocked", onUnlock);
    return () => window.removeEventListener("egg:unlocked", onUnlock);
  }, []);

  async function submitToLeaderboard() {
    const cleaned = name.trim();
    if (!eggId || cleaned.length < 2) return;

    setStatus("saving");
    try {
      const res = await fetch("/api/eggs/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ egg_id: eggId, name: cleaned }),
      });
      if (!res.ok) throw new Error("request failed");

      try {
        localStorage.setItem(NAME_KEY, cleaned);
      } catch {
        // ignore
      }
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  if (!open || !eggId) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="card p-6 max-w-sm w-[92vw] text-center bg-white rounded-xl shadow"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Secret unlocked"
      >
        <h3 className="text-lg font-semibold">Unlocked: {getEggName(eggId)}</h3>
        <p className="mt-2 text-sm text-zinc-700">
          Nice find! Add your name to this egg's leaderboard.
        </p>

        <input
          className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />

        {status === "error" && (
          <p className="mt-2 text-xs text-red-600">Couldn't save that — try again.</p>
        )}
        {status === "saved" && (
          <p className="mt-2 text-xs text-green-600">Added to the leaderboard!</p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            className="btn-primary"
            onClick={submitToLeaderboard}
            disabled={status === "saving" || status === "saved" || name.trim().length < 2}
          >
            {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Add to leaderboard"}
          </button>
          <a href="/egg-hunt" className="btn">
            View Egg Hunt
          </a>
          <button className="btn" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
