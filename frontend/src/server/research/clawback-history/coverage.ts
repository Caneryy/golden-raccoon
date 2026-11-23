import type { ClawbackHistoryState } from "./errors";

export function coverageNotice(state: ClawbackHistoryState, assetCode: string): string {
  if (state === "unavailable") {
    return "No data available. The asset may not exist or provider history may be unavailable.";
  }

  if (state === "partial") {
    return `Partial data for ${assetCode}. Some operations could not be fetched due to provider limits.`;
  }

  return `Read-only history of clawback and authorization operations for ${assetCode}. Data is limited by provider retention. Gaps in history are marked and excluded from totals.`;
}
