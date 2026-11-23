import { describe, expect, it } from "vitest";
import { buildSponsorshipGraph } from "@/server/research/sponsorship-map/sponsorshipGraph";
import { mockSponsoredEntries } from "./fixtures";

describe("sponsorshipGraph", () => {
  it("builds graph from entries", () => {
    const graph = buildSponsorshipGraph(mockSponsoredEntries);
    expect(graph.length).toBeGreaterThan(0);
  });

  it("groups entries by sponsor-sponsored pair", () => {
    const graph = buildSponsorshipGraph(mockSponsoredEntries);
    const edge = graph.find((e) => e.sponsor === "GSPONSOR1" && e.sponsored === "GSPONSORED1");
    expect(edge).toBeDefined();
    expect(edge?.entries.length).toBe(2);
  });

  it("calculates total reserve per edge", () => {
    const graph = buildSponsorshipGraph(mockSponsoredEntries);
    const edge = graph.find((e) => e.sponsor === "GSPONSOR1");
    expect(edge?.totalReserve).toBe("10000000");
  });
});
