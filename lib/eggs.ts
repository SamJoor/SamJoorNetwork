export type Egg = {
  id: string;
  label: string;
  description: string;
};

export const EGGS: Egg[] = [
  { id: "Null", label: "Null cheat", description: "Going rapidly a daring individual undertook spaceflight" },
  { id: "Seal", label: "Seal breaker", description: "5 hits to win" },
  { id: "pentagon", label: "Pentagon Cipher", description: "16th-century courtiers knew the method and hezcouf knows the answer" },
  { id: "Code", label: "Code", description: "I live in silence and in pause, no lips no ink and yet I speak. I bet you wish you knew more about me." },
  { id: "Teapot", label: "Teapot Mystery", description: "This is the last one, I hope you enjoyed my project!" },
];

/**
 * Returns a human-friendly egg label from its ID.
 * Falls back to showing the raw ID if no match is found.
 */
export function getEggName(id: string): string {
  const egg = EGGS.find((e) => e.id === id);
  return egg ? egg.label : id;
}
