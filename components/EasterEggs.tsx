// components/EasterEggs.tsx
"use client";

import { useEffect } from "react";
import { markEggFound, isEggFound } from "@/lib/eggProgress";
import { enableRetro } from "@/lib/retro";

function isTypingTarget(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
}

export default function EasterEggs() {
  /** -----------------------------
   *  "Null" — KONAMI CODE (↑↑↓↓←→←→BA)
   *  ----------------------------- */
  useEffect(() => {
    const seq = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let i = 0;

    const onKey = async (e: KeyboardEvent) => {
      if (isTypingTarget(e)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const target = seq[i].length === 1 ? seq[i].toLowerCase() : seq[i];
      if (key === target) {
        i++;
        if (i === seq.length) {
          i = 0;
          if (!(await isEggFound("Null"))) await markEggFound("Null");
        }
      } else {
        i = 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** -----------------------------------------
   *  "pentagon" — type "samjoor" (Vigenère puzzle answer)
   *  "Teapot"   — type "teapot" or "418" (HTTP 418 joke)
   *  ----------------------------------------- */
  useEffect(() => {
    let buf = "";
    let timer: number | undefined;

    const onKey = async (e: KeyboardEvent) => {
      if (isTypingTarget(e)) return;
      if (e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-16);

      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => (buf = ""), 3000);

      if (buf.endsWith("samjoor")) {
        if (!(await isEggFound("pentagon"))) await markEggFound("pentagon");
        buf = "";
      } else if (buf.endsWith("teapot") || buf.endsWith("418")) {
        if (!(await isEggFound("Teapot"))) await markEggFound("Teapot");
        buf = "";
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  /** -------------------------------------------------
   *  "Code" — MORSE input decoding to "retro"
   *     (spaces or 800ms gap end a letter; Enter adds a word space)
   *     Also enables a 60s retro visual mode.
   *  ------------------------------------------------- */
  useEffect(() => {
    const MORSE: Record<string, string> = {
      ".-": "a", "-...": "b", "-.-.": "c", "-..": "d", ".": "e", "..-.": "f",
      "--.": "g", "....": "h", "..": "i", ".---": "j", "-.-": "k", ".-..": "l",
      "--": "m", "-.": "n", "---": "o", ".--.": "p", "--.-": "q", ".-.": "r",
      "...": "s", "-": "t", "..-": "u", "...-": "v", ".--": "w", "-..-": "x",
      "-.--": "y", "--..": "z",
    };

    let token = "";
    let text = "";
    let letterTimer: number | undefined;

    const flushToken = () => {
      if (!token) return;
      const ch = MORSE[token] || "?";
      text = (text + ch).slice(-32);
      token = "";

      if (text.includes("retro")) {
        enableRetro(60_000);
        (async () => {
          if (!(await isEggFound("Code"))) await markEggFound("Code");
        })();
        text = "";
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e)) return;
      const k = e.key;

      if (k === "." || k === "-") {
        token += k;
        if (letterTimer) window.clearTimeout(letterTimer);
        letterTimer = window.setTimeout(flushToken, 800);
      } else if (k === " " || k === "/") {
        flushToken();
      } else if (k === "Enter") {
        flushToken();
        text += " ";
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (letterTimer) window.clearTimeout(letterTimer);
    };
  }, []);

  // Optional direct unlock via ?retro=1 (also counts as finding "Code")
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("retro") === "1") {
        enableRetro(60_000);
        (async () => {
          if (!(await isEggFound("Code"))) await markEggFound("Code");
        })();
      }
    } catch {
      // ignore
    }
  }, []);

  // No UI here — this component only wires listeners.
  return null;
}
