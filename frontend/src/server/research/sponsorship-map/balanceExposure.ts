import type { SponsoredEntry, RevocationOutcome } from "./schema";

export type BalanceInfo = {
  account: string;
  balance: string;
  numEntries: number;
};

export async function readAccountBalance(network: string, account: string): Promise<BalanceInfo> {
  // Placeholder implementation - would query Horizon or RPC
  return {
    account,
    balance: "100000000", // 10 XLM
    numEntries: 2,
  };
}

export function flagExposedAccounts(outcomes: RevocationOutcome[]): string[] {
  const exposed: string[] = [];
  
  for (const outcome of outcomes) {
    if (outcome.outcome === "underfunded" || outcome.outcome === "critical") {
      exposed.push(outcome.entryId);
    }
  }

  return exposed;
}
