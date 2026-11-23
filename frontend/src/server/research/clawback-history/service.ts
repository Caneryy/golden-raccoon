import { coverageNotice } from "./coverage";
import { ClawbackHistoryError, type ClawbackHistoryState } from "./errors";
import { validateAssetIdentity } from "./assetIdentity";
import { readOperations, type OperationDeps } from "./operationReader";
import { extractClawbackEvents } from "./clawbackEvents";
import { extractAuthorizationEvents } from "./authorizationEvents";
import { extractFlagChanges } from "./flagChanges";
import { groupByHolder } from "./holderGrouping";
import { calculateTotalClawedBack } from "./periodTotals";
import { detectRetentionGaps } from "./retentionGaps";
import { CLAWBACK_HISTORY_SCHEMA_VERSION, clawbackHistoryRequestSchema, type ClawbackHistoryReport } from "./schema";

export type ClawbackHistoryDeps = {
  operationDeps?: OperationDeps;
};

function unavailableReport(assetCode: string, issuer: string, network: string, reason: string): ClawbackHistoryReport {
  return {
    schemaVersion: CLAWBACK_HISTORY_SCHEMA_VERSION,
    assetCode,
    issuer,
    network,
    state: "unavailable",
    clawbackEvents: [],
    authorizationEvents: [],
    flagChanges: [],
    holderSummaries: [],
    totalClawedBack: "0",
    retentionGaps: [],
    oldestLedger: null,
    newestLedger: null,
    coverageNotice: `${coverageNotice("unavailable", assetCode)} ${reason}`,
    readOnly: true,
    writesState: false,
  };
}

/**
 * Reconstruct clawback and authorization-revocation history for an asset.
 * Never sends authenticated or state-changing requests.
 */
export async function reconstructClawbackHistory(body: unknown, deps: ClawbackHistoryDeps = {}): Promise<ClawbackHistoryReport> {
  const parseResult = clawbackHistoryRequestSchema.safeParse(body);
  if (!parseResult.success) {
    throw new ClawbackHistoryError("invalid_request", parseResult.error.errors[0]?.message ?? "Invalid request");
  }

  const { assetCode, issuer, network } = parseResult.data;
  const asset = validateAssetIdentity(assetCode, issuer);

  try {
    const operations = await readOperations(asset, network, deps.operationDeps);

    if (operations.length === 0) {
      return unavailableReport(asset.code, asset.issuer, network, "No operations found");
    }

    const clawbackEvents = extractClawbackEvents(operations, asset);
    const authorizationEvents = extractAuthorizationEvents(operations, asset);
    const flagChanges = extractFlagChanges(operations);
    const holderSummaries = groupByHolder(clawbackEvents, authorizationEvents);
    const totalClawedBack = calculateTotalClawedBack(clawbackEvents);

    const ledgers = operations.map((op) => op.ledger);
    const oldestLedger = ledgers.length > 0 ? Math.min(...ledgers) : null;
    const newestLedger = ledgers.length > 0 ? Math.max(...ledgers) : null;
    const retentionGaps = detectRetentionGaps(oldestLedger, newestLedger);

    const state: ClawbackHistoryState = "complete";

    return {
      schemaVersion: CLAWBACK_HISTORY_SCHEMA_VERSION,
      assetCode: asset.code,
      issuer: asset.issuer,
      network,
      state,
      clawbackEvents,
      authorizationEvents,
      flagChanges,
      holderSummaries,
      totalClawedBack,
      retentionGaps,
      oldestLedger,
      newestLedger,
      coverageNotice: coverageNotice(state, asset.code),
      readOnly: true,
      writesState: false,
    };
  } catch (error) {
    if (error instanceof ClawbackHistoryError) {
      throw error;
    }
    return unavailableReport(asset.code, asset.issuer, network, error instanceof Error ? error.message : "Failed to fetch operations");
  }
}
