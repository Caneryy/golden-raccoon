import { CLAWBACK_HISTORY_LIMITS } from "./limits";
import type { ClawbackEvent, AuthorizationEvent, HolderSummary } from "./schema";

export function groupByHolder(
  clawbackEvents: ClawbackEvent[],
  authorizationEvents: AuthorizationEvent[],
): HolderSummary[] {
  const holderMap = new Map<string, HolderSummary>();

  for (const event of clawbackEvents) {
    const existing = holderMap.get(event.affectedAccount);
    if (existing) {
      existing.clawbackCount += 1;
      existing.totalClawedBack = (parseFloat(existing.totalClawedBack) + parseFloat(event.amount)).toFixed(7);
    } else {
      holderMap.set(event.affectedAccount, {
        account: event.affectedAccount,
        clawbackCount: 1,
        totalClawedBack: event.amount,
        authorizationRevocations: 0,
      });
    }
  }

  for (const event of authorizationEvents) {
    if (!event.authorized) {
      const existing = holderMap.get(event.affectedAccount);
      if (existing) {
        existing.authorizationRevocations += 1;
      } else {
        holderMap.set(event.affectedAccount, {
          account: event.affectedAccount,
          clawbackCount: 0,
          totalClawedBack: "0",
          authorizationRevocations: 1,
        });
      }
    }
  }

  return Array.from(holderMap.values())
    .sort((a, b) => parseFloat(b.totalClawedBack) - parseFloat(a.totalClawedBack))
    .slice(0, CLAWBACK_HISTORY_LIMITS.maxHolders);
}
