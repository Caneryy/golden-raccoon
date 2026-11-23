import { describe, expect, it } from "vitest";
import { mapSponsorships } from "@/server/research/sponsorship-map/service";
import { SponsorshipMapError } from "@/server/research/sponsorship-map/errors";

describe("service", () => {
  it("validates request schema", async () => {
    await expect(mapSponsorships({})).rejects.toThrow(SponsorshipMapError);
    await expect(mapSponsorships({ account: "" })).rejects.toThrow(SponsorshipMapError);
  });

  it("maps sponsorships for valid request", async () => {
    const request = {
      account: "GABC123",
      network: "stellar-testnet" as const,
    };
    const report = await mapSponsorships(request);
    expect(report).toBeDefined();
    expect(report.schemaVersion).toBe(1);
    expect(report.account).toBe("GABC123");
    expect(report.state).toMatch(/complete|partial|unavailable/);
  });

  it("includes sponsorship edges", async () => {
    const request = {
      account: "GABC123",
      network: "stellar-testnet" as const,
    };
    const report = await mapSponsorships(request);
    expect(report.sponsorships).toBeDefined();
    expect(Array.isArray(report.sponsorships)).toBe(true);
  });

  it("includes revocation outcomes for sponsored entries", async () => {
    const request = {
      account: "GABC123",
      network: "stellar-testnet" as const,
    };
    const report = await mapSponsorships(request);
    expect(report.revocationOutcomes).toBeDefined();
    expect(Array.isArray(report.revocationOutcomes)).toBe(true);
  });
});
