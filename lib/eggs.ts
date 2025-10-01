// lib/eggs.ts
export type Egg = {
  id: string;
  label: string;
  description: string;
};

export const EGGS: Egg[] = [
  { id: "konami",      label: "The Lost Sequence",   description: "Going rapidly a daring individual undertook spaceflight" },
  { id: "clicky-logo", label: "Break the seal",   description: "When the fifth seal broke, silence swept the heavens." },
  { id: "samjoor",     label: "pentagon Cipher",     description: "A five-sided guardian keeps its secrets well. 16th-century courtiers knew the method; the key is the fortress of power. Just in case, hezcouf knows the answer" },
  { id: "retro",       label: "OG Mimicry",    description: "I live in silence and in pause, no lips no ink and yet I speak" },
  { id: "coffee",      label: "coming soon",  description: "" },
];
