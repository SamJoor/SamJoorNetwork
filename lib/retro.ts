// lib/retro.ts
"use client";

const KEY = "retroMode";        // "1" when active
const EXP_KEY = "retroExpire";  // epoch ms when it should auto-expire

export function enableRetro(durationMs = 60_000) {
  try {
    const until = Date.now() + durationMs;
    localStorage.setItem(KEY, "1");
    localStorage.setItem(EXP_KEY, String(until));
    window.dispatchEvent(new Event("retro:change"));
  } catch {}
}

export function disableRetro() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(EXP_KEY);
    window.dispatchEvent(new Event("retro:change"));
  } catch {}
}

export function isRetroEnabled(): boolean {
  if (typeof window === "undefined") return false;
  // also check expiry (if expired, clean up)
  const expStr = localStorage.getItem(EXP_KEY);
  if (expStr) {
    const exp = Number(expStr);
    if (!Number.isNaN(exp) && Date.now() > exp) {
      disableRetro();
      return false;
    }
  }
  return localStorage.getItem(KEY) === "1";
}

/** Remaining ms (0 if off/expired) */
export function retroRemainingMs(): number {
  if (typeof window === "undefined") return 0;
  const expStr = localStorage.getItem(EXP_KEY);
  if (!expStr) return 0;
  const exp = Number(expStr);
  if (Number.isNaN(exp)) return 0;
  return Math.max(0, exp - Date.now());
}
