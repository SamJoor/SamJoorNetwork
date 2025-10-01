"use client";
import { useEffect, useState } from "react";
import { unlockEgg } from "@/lib/eggProgress";

export default function RetroStyle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const on = new URLSearchParams(window.location.search).get("retro") === "1";
    setEnabled(on);
    if (on) unlockEgg("retro");
  }, []);

  if (!enabled) return null;

  return (
    <style>{`
      * { transition: none !important; }
      body { background: repeating-linear-gradient(0deg,#fff, #fff 2px,#f1f5f9 2px, #f1f5f9 4px); }
      .card { border: 3px double #111 !important; border-radius: 0 !important; }
      .btn, .btn-primary { transform: skewX(-6deg); font-family: "Comic Sans MS", system-ui; }
      a:hover { text-decoration: underline wavy; }
    `}</style>
  );
}
