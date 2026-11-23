import { z } from "zod";

export const SPONSORSHIP_MAP_SCHEMA_VERSION = 1;

export const sponsorshipMapRequestSchema = z.object({
  account: z.string().min(1),
  network: z.enum(["stellar-testnet", "stellar-pubnet"]),
});

export type SponsorshipMapRequest = z.infer<typeof sponsorshipMapRequestSchema>;

export type EntryType = "trustline" | "offer" | "data" | "signer" | "claimable_balance";

export type SponsoredEntry = {
  id: string;
  type: EntryType;
  sponsor: string;
  sponsored: string;
  reserveAmount: string;
};

export type RevocationOutcome = {
  entryId: string;
  outcome: "safe" | "underfunded" | "critical";
  requiredBalance: string;
  currentBalance: string;
  explanation: string;
};

export type SponsorshipEdge = {
  sponsor: string;
  sponsored: string;
  entries: SponsoredEntry[];
  totalReserve: string;
};

export type SponsorshipMapReport = {
  schemaVersion: number;
  account: string;
  network: string;
  state: "complete" | "partial" | "unavailable";
  numSponsoring: number;
  numSponsored: number;
  sponsorships: SponsorshipEdge[];
  revocationOutcomes: RevocationOutcome[];
  coverageNotice: string;
  baseReserveSource: string;
  readOnly: boolean;
};
