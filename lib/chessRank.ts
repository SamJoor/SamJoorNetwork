export function eloToRank(elo: number): string {
  if (elo < 900) return "Beginner";
  if (elo < 1100) return "Novice";
  if (elo < 1300) return "Class D";
  if (elo < 1500) return "Class C";
  if (elo < 1700) return "Class B";
  if (elo < 1900) return "Class A";
  if (elo < 2100) return "Expert";
  if (elo < 2300) return "Candidate Master";
  return "Master";
}
