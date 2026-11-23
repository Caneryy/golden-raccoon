import type { RetentionGap } from "./schema";

export function detectRetentionGaps(oldestLedger: number | null, newestLedger: number | null): RetentionGap[] {
  if (oldestLedger === null || newestLedger === null) {
    return [{
      startLedger: null,
      endLedger: null,
      reason: "Provider history not available",
    }];
  }

  return [];
}
