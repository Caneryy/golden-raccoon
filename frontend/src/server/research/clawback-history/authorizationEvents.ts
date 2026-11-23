import type { AssetIdentity } from "./assetIdentity";
import type { Operation } from "./operationReader";
import type { AuthorizationEvent } from "./schema";

export function extractAuthorizationEvents(operations: Operation[], asset: AssetIdentity): AuthorizationEvent[] {
  const events: AuthorizationEvent[] = [];

  for (const op of operations) {
    if (op.type === "set_trust_line_flags" || op.type === "allow_trust") {
      if (op.asset_code === asset.code && op.asset_issuer === asset.issuer) {
        events.push({
          ledger: op.ledger,
          timestamp: op.created_at,
          operation: op.type as "set_trust_line_flags" | "allow_trust",
          affectedAccount: op.trustor ?? "unknown",
          authorized: op.authorize ?? false,
          transactionHash: op.transaction_hash,
        });
      }
    }
  }

  return events.sort((a, b) => a.ledger - b.ledger);
}
