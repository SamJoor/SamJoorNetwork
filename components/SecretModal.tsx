"use client";
import { useEffect, useState } from "react";
import { unlockEgg } from "@/lib/eggProgress";

export default function SecretModal() {
  const [open, setOpen] = useState(false);
  const [unlockedLabel, setUnlockedLabel] = useState<string | null>(null);

  useEffect(() => {
    let buf = "";

    function normalizeKey(e: KeyboardEvent): string {
      // ignore typing in inputs/textareas/contenteditable
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return "";
      }
      const k = e.key.toLowerCase();
      // letters & digits only
      if (/^[a-z0-9]$/.test(k)) return k;
      return "";
    }

    async function maybeUnlockFromBuffer(b: string) {
      // check longest first; buffer holds last 10 chars
      if (b.endsWith("samjoor")) {
        await unlockEgg("samjoor");
        setUnlockedLabel("SamJoor Cipher");
        setOpen(true);
        // notify listeners (e.g., Egg Hunt page) this egg was solved
        window.dispatchEvent(new CustomEvent("egg:unlocked", { detail: { id: "samjoor" } }));
        return;
      }
      if (b.endsWith("teapot") || b.endsWith("418")) {
        await unlockEgg("418");
        setUnlockedLabel("(418)");
        setOpen(true);
        window.dispatchEvent(new CustomEvent("egg:unlocked", { detail: { id: "teapot" } }));
        return;
      }
      // add more typed-answer eggs here if you want, e.g.:
      // if (b.endsWith("retro")) { await unlockEgg("retro"); ... }
    }

    const onKey = (e: KeyboardEvent) => {
      const k = normalizeKey(e);
      if (!k) return;
      buf = (buf + k).slice(-10); // keep last 10 chars
      void maybeUnlockFromBuffer(buf);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={() => setOpen(false)}
    >
      <div
        className="card p-6 max-w-sm w-[92vw] text-center bg-white rounded-xl shadow"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Secret unlocked"
      >
        <h3 className="text-lg font-semibold">
          {unlockedLabel ? `Unlocked: ${unlockedLabel}` : "Good work—this one was hard."}
        </h3>
        <p className="mt-2 text-sm text-zinc-700">
          Your progress has been saved locally. Check the Egg Hunt page to see your status and the leaderboard.
        </p>
        <a href="/egg-hunt" className="btn-primary mt-4 inline-block">
          View Egg Hunt
        </a>
      </div>
    </div>
  );
}
