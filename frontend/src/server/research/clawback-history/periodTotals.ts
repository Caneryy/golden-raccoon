import type { ClawbackEvent } from "./schema";

export function calculateTotalClawedBack(events: ClawbackEvent[]): string {
  let total = 0;
  for (const event of events) {
    total += parseFloat(event.amount);
  }
  return total.toFixed(7);
}
