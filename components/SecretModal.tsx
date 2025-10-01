"use client";
import { useEffect, useState } from "react";
import { unlockEgg } from "@/lib/eggProgress";

export default function SecretModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let buf = "";
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT","TEXTAREA"].includes(target.tagName)) return;
      buf = (buf + e.key.toLowerCase()).slice(-7);
      if (buf === "samjoor") {
        unlockEgg("samjoor");
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center" onClick={() => setOpen(false)}>
      <div className="card p-6 max-w-sm text-center bg-white rounded-xl shadow" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">You found a secret! 🐣</h3>
        <p className="mt-2 text-sm text-zinc-700">
          Take a screenshot and tag me — bonus points if you find the other 4.
        </p>
        <a href="/egg-hunt" className="btn-primary mt-4 inline-block">View progress</a>
      </div>
    </div>
  );
}
