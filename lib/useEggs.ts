// lib/useEggs.ts
"use client";

import { useEffect, useState } from "react";
import { getProgress, setProgress, markEggFound, isEggFound } from "./eggProgress";
import { EGGS } from "./eggs";

/** Single-egg hook */
export function useEgg(id: string): [boolean, (found: boolean) => Promise<void>] {
  const [found, setFoundState] = useState(false);

  useEffect(() => {
    (async () => setFoundState(await isEggFound(id)))();
  }, [id]);

  const setFound = async (val: boolean) => {
    if (!val) return;           // we only mark as found
    await markEggFound(id);     // persists + fires 'egg:unlocked'
    setFoundState(true);
  };

  return [found, setFound];
}

/** All eggs + found flags */
export function useAllEggs() {
  const [progress, setLocalProgress] = useState<string[]>([]);

  useEffect(() => {
    (async () => setLocalProgress(await getProgress()))();

    // listen for in-tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === "eggsFound") {
        (async () => setLocalProgress(await getProgress()))();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return EGGS.map(e => ({ ...e, found: progress.includes(e.id) }));
}
