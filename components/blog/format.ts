/** Greek reading-time label with correct singular/plural ("1 λεπτό", "5 λεπτά"). */
export function formatReadingTime(minutes: number): string {
  return `${minutes} ${minutes === 1 ? "λεπτό" : "λεπτά"} ανάγνωση`;
}
