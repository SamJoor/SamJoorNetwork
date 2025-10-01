// lib/eggProgress.ts
"use client";

export type Progress = string[];

const PROGRESS_URL = "/api/eggs/progress";

/** ---- Core helpers (cookie/API backed) ---- */

export async function getProgress(): Promise<Progress> {
  try {
    const res = await fetch(PROGRESS_URL, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.found) ? (data.found as string[]) : [];
  } catch {
    return [];
  }
}

export async function setProgress(found: Progress) {
  try {
    await fetch(PROGRESS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ found: Array.from(new Set(found)) }),
    });
    // notify listeners (mimic storage change)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new StorageEvent("storage", { key: "eggsFound" }));
    }
  } catch {
    // swallow
  }
}

export async function markEggFound(id: string) {
  const current = await getProgress();
  if (!current.includes(id)) {
    await setProgress([...current, id]);
    // fire the unlock event so LeaderboardPrompt opens
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("egg:unlocked", { detail: { id } }));
    }
  }
}

export async function isEggFound(id: string): Promise<boolean> {
  const current = await getProgress();
  return current.includes(id);
}

/** ---- Back-compat exports (so older imports keep working) ---- */

// Old code may import these names:
export async function getEggsFound(): Promise<string[]> {
  return await getProgress();
}
export async function setEggsFound(ids: string[]) {
  await setProgress(ids);
}
export async function unlockEgg(id: string) {
  await markEggFound(id);
}
/** Kept for API parity; cookie backend doesn’t need a special sync step */
export async function syncFromServer(): Promise<void> {
  await getProgress();
}
