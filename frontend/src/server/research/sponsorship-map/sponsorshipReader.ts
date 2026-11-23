import type { SponsoredEntry } from "./schema";

export type SponsorshipReadOutcome =
  | { status: "available"; numSponsoring: number; numSponsored: number; entries: SponsoredEntry[] }
  | { status: "unavailable"; reason: string }
  | { status: "missing" };

export async function readSponsorships(
  network: string,
  account: string,
): Promise<SponsorshipReadOutcome> {
  // Placeholder implementation - would query Horizon or RPC for account details
  // and read sponsored entries (trustlines, offers, data, signers, claimable balances)
  return {
    status: "available",
    numSponsoring: 2,
    numSponsored: 1,
    entries: [
      {
        id: "entry-1",
        type: "trustline",
        sponsor: account,
        sponsored: "GSPONSORED1",
        reserveAmount: "5000000",
      },
      {
        id: "entry-2",
        type: "offer",
        sponsor: account,
        sponsored: "GSPONSORED2",
        reserveAmount: "5000000",
      },
      {
        id: "entry-3",
        type: "trustline",
        sponsor: "GSPONSOR",
        sponsored: account,
        reserveAmount: "5000000",
      },
    ],
  };
}
