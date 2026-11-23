import { validateAccountInput } from "./accountInput";
import { readAccountBalance, flagExposedAccounts } from "./balanceExposure";
import { coverageNotice } from "./coverage";
import { SponsorshipMapError } from "./errors";
import { SPONSORSHIP_MAP_LIMITS } from "./limits";
import { analyzeRevocation } from "./revocationOutcome";
import { SPONSORSHIP_MAP_SCHEMA_VERSION, sponsorshipMapRequestSchema, type SponsorshipMapReport } from "./schema";
import { buildSponsorshipGraph } from "./sponsorshipGraph";
import { readSponsorships } from "./sponsorshipReader";

export type SponsorshipMapDeps = {
  readSponsorships: typeof readSponsorships;
  readBalance: typeof readAccountBalance;
};

const productionDeps: SponsorshipMapDeps = {
  readSponsorships,
  readBalance: readAccountBalance,
};

function unavailableReport(
  account: string,
  network: string,
  reason: string,
): SponsorshipMapReport {
  return {
    schemaVersion: SPONSORSHIP_MAP_SCHEMA_VERSION,
    account,
    network,
    state: "unavailable",
    numSponsoring: 0,
    numSponsored: 0,
    sponsorships: [],
    revocationOutcomes: [],
    coverageNotice: `Sponsorship map unavailable: ${reason}`,
    baseReserveSource: "protocol",
    readOnly: true,
  };
}

export async function mapSponsorships(
  input: unknown,
  deps: SponsorshipMapDeps = productionDeps,
): Promise<SponsorshipMapReport> {
  const parsed = sponsorshipMapRequestSchema.safeParse(input);
  if (!parsed.success) {
    throw new SponsorshipMapError("invalid_request", "The request is invalid.", parsed.error.flatten());
  }

  const validated = validateAccountInput(parsed.data);
  const { account, network } = validated;

  const result = await deps.readSponsorships(network, account);

  if (result.status === "unavailable") {
    return unavailableReport(account, network, result.reason);
  }

  if (result.status === "missing") {
    throw new SponsorshipMapError("not_found", "Account not found on the selected network.");
  }

  const { numSponsoring, numSponsored, entries } = result;

  if (entries.length > SPONSORSHIP_MAP_LIMITS.maxSponsorships) {
    throw new SponsorshipMapError("response_too_large", "Too many sponsorships to process.");
  }

  const sponsorships = buildSponsorshipGraph(entries);

  // Analyze revocation outcomes for each sponsored entry
  const revocationOutcomes = await Promise.all(
    entries
      .filter((entry) => entry.sponsored === account)
      .map(async (entry) => {
        const balanceInfo = await deps.readBalance(network, entry.sponsored);
        return analyzeRevocation(entry, balanceInfo.balance, balanceInfo.numEntries);
      }),
  );

  const state = "complete";

  return {
    schemaVersion: SPONSORSHIP_MAP_SCHEMA_VERSION,
    account,
    network,
    state,
    numSponsoring,
    numSponsored,
    sponsorships,
    revocationOutcomes,
    coverageNotice: coverageNotice(state, numSponsoring, numSponsored),
    baseReserveSource: "protocol",
    readOnly: true,
  };
}
