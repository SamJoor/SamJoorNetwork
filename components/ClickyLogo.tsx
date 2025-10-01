// app/components/ClickyLogo.tsx
"use client";

import { useState } from "react";
import { markEggFound, isEggFound } from "@/lib/eggProgress";
// IMPORTANT: make sure LogoSJ is a **named** export in DevLinkd.tsx
import { LogoSJ } from "./DevLinkd";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function ClickyLogo({ className = "h-7 w-7", children }: Props) {
  const [clicks, setClicks] = useState(0);
  const [boom, setBoom] = useState(false);

  async function handleClick() {
    const next = clicks + 1;
    setClicks(next);

    if (next >= 5) {
      setBoom(true);
      setTimeout(() => setBoom(false), 800);

      if (!(await isEggFound("clicky-logo"))) {
        await markEggFound("clicky-logo");
      }
      setClicks(0);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label="SamJoorNetwork logo"
        className={`inline-flex items-center justify-center select-none transition-transform duration-150 ${
          boom ? "scale-0 rotate-12" : "hover:scale-110"
        } ${className}`}
      >
        {/* Use provided child if present; otherwise render default LogoSJ */}
        {children ?? <LogoSJ className={className} />}
      </button>

      {/* ring burst */}
      {boom && (
        <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-blue-400/80 animate-[ping_0.8s_ease-out_1]" />
      )}
    </div>
  );
}
