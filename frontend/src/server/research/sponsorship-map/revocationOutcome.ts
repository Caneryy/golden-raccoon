import type { SponsoredEntry, RevocationOutcome } from "./schema";
import { calculateRequiredReserve, hasMinimumBalance } from "./reserveMath";

export async function analyzeRevocation(
  entry: SponsoredEntry,
  sponsoredBalance: string,
  sponsoredNumEntries: number,
): Promise<RevocationOutcome> {
  const requiredBalance = calculateRequiredReserve(sponsoredNumEntries + 1); // +1 for the entry that would become unsponsored
  const currentBalanceBig = BigInt(sponsoredBalance);
  const requiredBalanceBig = BigInt(requiredBalance);

  let outcome: "safe" | "underfunded" | "critical";
  let explanation: string;

  if (currentBalanceBig >= requiredBalanceBig) {
    outcome = "safe";
    explanation = "Account has sufficient balance to cover reserve if sponsorship is revoked.";
  } else if (currentBalanceBig > 0n) {
    outcome = "underfunded";
    explanation = "Account would fall below minimum balance if sponsorship is revoked.";
  } else {
    outcome = "critical";
    explanation = "Account has zero balance and would fail immediately if sponsorship is revoked.";
  }

  return {
    entryId: entry.id,
    outcome,
    requiredBalance,
    currentBalance: sponsoredBalance,
    explanation,
  };
}
