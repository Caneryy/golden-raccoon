import type { Operation } from "./operationReader";
import type { FlagChange } from "./schema";

const FLAG_NAMES: Record<number, string> = {
  1: "AUTH_REQUIRED",
  2: "AUTH_REVOCABLE",
  4: "AUTH_IMMUTABLE",
  8: "AUTH_CLAWBACK_ENABLED",
};

export function extractFlagChanges(operations: Operation[]): FlagChange[] {
  const changes: FlagChange[] = [];

  for (const op of operations) {
    if (op.type === "set_options") {
      if (op.set_flags) {
        for (const flag of op.set_flags) {
          if (FLAG_NAMES[flag]) {
            changes.push({
              ledger: op.ledger,
              timestamp: op.created_at,
              operation: "set_options",
              flag: FLAG_NAMES[flag]!,
              enabled: true,
              transactionHash: op.transaction_hash,
            });
          }
        }
      }
      if (op.clear_flags) {
        for (const flag of op.clear_flags) {
          if (FLAG_NAMES[flag]) {
            changes.push({
              ledger: op.ledger,
              timestamp: op.created_at,
              operation: "set_options",
              flag: FLAG_NAMES[flag]!,
              enabled: false,
              transactionHash: op.transaction_hash,
            });
          }
        }
      }
    }
  }

  return changes.sort((a, b) => a.ledger - b.ledger);
}
