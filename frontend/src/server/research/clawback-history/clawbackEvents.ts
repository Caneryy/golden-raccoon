import type { AssetIdentity } from "./assetIdentity";
import type { Operation } from "./operationReader";
import type { ClawbackEvent } from "./schema";

export function extractClawbackEvents(operations: Operation[], asset: AssetIdentity): ClawbackEvent[] {
  const events: ClawbackEvent[] = [];

  for (const op of operations) {
    if (op.type === "clawback" || op.type === "clawback_claimable_balance") {
      if (op.asset_code === asset.code && op.asset_issuer === asset.issuer) {
        events.push({
          ledger: op.ledger,
          timestamp: op.created_at,
          operation: op.type as "clawback" | "clawback_claimable_balance",
          affectedAccount: op.from ?? "unknown",
          amount: op.amount ?? "0",
          transactionHash: op.transaction_hash,
        });
      }
    }
  }

  return events.sort((a, b) => a.ledger - b.ledger);
}
