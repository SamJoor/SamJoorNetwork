// components/RetroStyle.tsx
"use client";

import { useEffect, useState } from "react";
import { isRetroEnabled, retroRemainingMs, disableRetro } from "@/lib/retro";

export default function RetroStyle() {
  const [on, setOn] = useState(false);
  const [remaining, setRemaining] = useState(0);

  // React to changes (manual toggle or other triggers)
  useEffect(() => {
    const apply = () => {
      const active = isRetroEnabled();
      setOn(active);
      setRemaining(active ? retroRemainingMs() : 0);
    };
    apply();
    const handler = () => apply();
    window.addEventListener("retro:change", handler);
    return () => window.removeEventListener("retro:change", handler);
  }, []);

  // Manage <html class="retro"> and a 1s timer that counts down & auto-disables
  useEffect(() => {
    const el = document.documentElement;
    if (on) el.classList.add("retro");
    else el.classList.remove("retro");

    if (!on) return;

    const tick = () => {
      const left = retroRemainingMs();
      setRemaining(left);
      if (left <= 0) {
        disableRetro();
        setOn(false);
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [on]);

  // Tiny HUD when active
  if (!on) return null;

  const secs = Math.ceil(remaining / 1000);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[80] pointer-events-none"
    >
      <div className="pointer-events-auto rounded-full bg-black/80 text-white text-xs px-3 py-1 shadow-md border border-white/20">
        CRT mode engaged • auto-off in {secs}s
      </div>
    </div>
  );
}
