import { StrKey } from "@stellar/stellar-sdk";
import { z } from "zod";
import type { ClawbackHistoryState } from "./errors";

export const CLAWBACK_HISTORY_SCHEMA_VERSION = "clawback-history/2026-01" as const;

export const clawbackHistoryRequestSchema = z.object({
  assetCode: z.string().trim().min(1, "Asset code is required").max(12, "Asset code too long"),
  issuer: z.string().trim().refine((value) => StrKey.isValidEd25519PublicKey(value), "Expected a valid Stellar issuer account"),
  network: z.enum(["stellar-testnet", "stellar-pubnet"]).default("stellar-pubnet"),
});

export type ClawbackHistoryRequest = z.infer<typeof clawbackHistoryRequestSchema>;

export type ClawbackEvent = {
  ledger: number;
  timestamp: string;
  operation: "clawback" | "clawback_claimable_balance";
  affectedAccount: string;
  amount: string;
  transactionHash: string;
};

export type AuthorizationEvent = {
  ledger: number;
  timestamp: string;
  operation: "set_trust_line_flags" | "allow_trust";
  affectedAccount: string;
  authorized: boolean;
  transactionHash: string;
};

export type FlagChange = {
  ledger: number;
  timestamp: string;
  operation: "set_options";
  flag: string;
  enabled: boolean;
  transactionHash: string;
};

export type HolderSummary = {
  account: string;
  clawbackCount: number;
  totalClawedBack: string;
  authorizationRevocations: number;
};

export type RetentionGap = {
  startLedger: number | null;
  endLedger: number | null;
  reason: string;
};

export type ClawbackHistoryReport = {
  schemaVersion: typeof CLAWBACK_HISTORY_SCHEMA_VERSION;
  assetCode: string;
  issuer: string;
  network: string;
  state: ClawbackHistoryState;
  clawbackEvents: ClawbackEvent[];
  authorizationEvents: AuthorizationEvent[];
  flagChanges: FlagChange[];
  holderSummaries: HolderSummary[];
  totalClawedBack: string;
  retentionGaps: RetentionGap[];
  oldestLedger: number | null;
  newestLedger: number | null;
  coverageNotice: string;
  readOnly: true;
  writesState: false;
};
