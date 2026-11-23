import type { SponsoredEntry, SponsorshipEdge, SponsorshipMapReport } from "@/server/research/sponsorship-map/schema";

export const mockSponsoredEntries: SponsoredEntry[] = [
  {
    id: "entry-1",
    type: "trustline",
    sponsor: "GSPONSOR1",
    sponsored: "GSPONSORED1",
    reserveAmount: "5000000",
  },
  {
    id: "entry-2",
    type: "offer",
    sponsor: "GSPONSOR1",
    sponsored: "GSPONSORED1",
    reserveAmount: "5000000",
  },
  {
    id: "entry-3",
    type: "trustline",
    sponsor: "GSPONSOR2",
    sponsored: "GSPONSORED2",
    reserveAmount: "5000000",
  },
];

export const sponsorAccountReport: SponsorshipMapReport = {
  schemaVersion: 1,
  account: "GSPONSOR1",
  network: "stellar-testnet",
  state: "complete",
  numSponsoring: 2,
  numSponsored: 0,
  sponsorships: [
    {
      sponsor: "GSPONSOR1",
      sponsored: "GSPONSORED1",
      entries: [
        {
          id: "entry-1",
          type: "trustline",
          sponsor: "GSPONSOR1",
          sponsored: "GSPONSORED1",
          reserveAmount: "5000000",
        },
        {
          id: "entry-2",
          type: "offer",
          sponsor: "GSPONSOR1",
          sponsored: "GSPONSORED1",
          reserveAmount: "5000000",
        },
      ],
      totalReserve: "10000000",
    },
  ],
  revocationOutcomes: [],
  coverageNotice: "Complete coverage: 2 entries sponsored, 0 entries receiving sponsorship.",
  baseReserveSource: "protocol",
  readOnly: true,
};

export const sponsoredAccountReport: SponsorshipMapReport = {
  schemaVersion: 1,
  account: "GSPONSORED1",
  network: "stellar-testnet",
  state: "complete",
  numSponsoring: 0,
  numSponsored: 2,
  sponsorships: [
    {
      sponsor: "GSPONSOR1",
      sponsored: "GSPONSORED1",
      entries: [
        {
          id: "entry-1",
          type: "trustline",
          sponsor: "GSPONSOR1",
          sponsored: "GSPONSORED1",
          reserveAmount: "5000000",
        },
        {
          id: "entry-2",
          type: "offer",
          sponsor: "GSPONSOR1",
          sponsored: "GSPONSORED1",
          reserveAmount: "5000000",
        },
      ],
      totalReserve: "10000000",
    },
  ],
  revocationOutcomes: [
    {
      entryId: "entry-1",
      outcome: "safe",
      requiredBalance: "15000000",
      currentBalance: "50000000",
      explanation: "Account has sufficient balance to cover reserve if sponsorship is revoked.",
    },
  ],
  coverageNotice: "Complete coverage: 0 entries sponsored, 2 entries receiving sponsorship.",
  baseReserveSource: "protocol",
  readOnly: true,
};
