// components/EasterEggs.tsx
"use client";

import { useEffect } from "react";
import { markEggFound, isEggFound } from "@/lib/eggProgress";
import { enableRetro } from "@/lib/retro";

export default function EasterEggs() {
  /** -----------------------------
   *  1) KONAMI CODE (↑↑↓↓←→←→BA)
   *  ----------------------------- */
  useEffect(() => {
    const seq = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let i = 0;

    const onKey = async (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const target = seq[i].length === 1 ? seq[i].toLowerCase() : seq[i];
      if (key === target) {
        i++;
        if (i === seq.length) {
          i = 0;
          if (!(await isEggFound("konami"))) {
            await markEggFound("konami");
          }
        }
      } else {
        i = 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** -----------------------------------------
   *  2) NAME/CIPHER EGG — type "samjoor"
   *     (You present a Vigenère puzzle; solution is "samjoor")
   *  ----------------------------------------- */
  useEffect(() => {
    let buf = "";
    let timer: number | undefined;

    const onKey = async (e: KeyboardEvent) => {
      if (e.key.length !== 1) return; // letters/numbers only
      buf += e.key.toLowerCase();
      if (buf.length > 64) buf = buf.slice(-64);

      // idle reset (3s)
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => (buf = ""), 3000);

      if (buf.includes("samjoor")) {
        if (!(await isEggFound("samjoor"))) {
          await markEggFound("samjoor");
        }
        buf = ""; // avoid spamming
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  /** -------------------------------------------------
   *  3) RETRO MODE via MORSE input:
   *     Type ".-." " " "." " " "-" " " ".-." " " "---"
   *     (spaces or 800ms gap end a letter; Enter adds space)
   *     When "retro" decoded -> enable retro for 60s + unlock.
   *  ------------------------------------------------- */
  useEffect(() => {
    // Minimal Morse table (letters a-z)
    const MORSE: Record<string, string> = {
      ".-": "a", "-...": "b", "-.-.": "c", "-..": "d", ".": "e", "..-.": "f",
      "--.": "g", "....": "h", "..": "i", ".---": "j", "-.-": "k", ".-..": "l",
      "--": "m", "-.": "n", "---": "o", ".--.": "p", "--.-": "q", ".-.": "r",
      "...": "s", "-": "t", "..-": "u", "...-": "v", ".--": "w", "-..-": "x",
      "-.--": "y", "--..": "z",
    };

    let token = ""; // current dot-dash token for one letter
    let text = "";  // decoded running text
    let letterTimer: number | undefined;

    const flushToken = () => {
      if (!token) return;
      const ch = MORSE[token] || "?";
      text += ch;
      token = "";

      // keep buffer manageable
      if (text.length > 32) text = text.slice(-32);

      if (text.includes("retro")) {
        // Enable retro for 60 seconds
        enableRetro(60_000);
        (async () => {
          if (!(await isEggFound("retro"))) await markEggFound("retro");
        })();
        text = ""; // reset to avoid loops
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key;

      if (k === "." || k === "-") {
        // building a Morse letter
        token += k;

        // End of letter when no dot/dash for 800ms
        if (letterTimer) window.clearTimeout(letterTimer);
        letterTimer = window.setTimeout(flushToken, 800);
      } else if (k === " " || k === "/") {
        // Explicit letter/word separator
        flushToken();
      } else if (k === "Enter") {
        // End of word
        flushToken();
        text += " ";
      } else {
        // ignore other keys
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (letterTimer) window.clearTimeout(letterTimer);
    };
  }, []);

  /** ------------------------------------------------------
   *  4) OPTIONAL: ?retro=1 also enables Retro for 60 seconds
   *  ------------------------------------------------------ */
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("retro") === "1") {
        enableRetro(60_000);
        (async () => {
          if (!(await isEggFound("retro"))) await markEggFound("retro");
        })();
      }
    } catch {
      // ignore
    }
  }, []);

  // No UI here — this component only wires listeners.
  return null;
}
