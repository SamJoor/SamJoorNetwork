// app/components/EasterEggs.tsx
"use client";

import { useEffect } from "react";
import { markEggFound, isEggFound } from "@/lib/eggProgress";

export default function EasterEggs() {
  // Konami Code
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let i = 0;
    const onKey = async (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === seq[i] || key === seq[i].toLowerCase()) {
        i++;
        if (i === seq.length) {
          i = 0;
          if (!(await isEggFound("konami"))) await markEggFound("konami");
        }
      } else {
        i = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Type "samjoor" anywhere
  useEffect(() => {
    const target = "samjoor";
    let buf = "";
    const onKey = async (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        buf = (buf + e.key.toLowerCase()).slice(-target.length);
        if (buf === target) {
          if (!(await isEggFound("samjoor"))) await markEggFound("samjoor");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Retro Mode via ?retro=1
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("retro") === "1") {
      (async () => {
        if (!(await isEggFound("retro"))) await markEggFound("retro");
      })();
    }
  }, []);

  return null;
}
