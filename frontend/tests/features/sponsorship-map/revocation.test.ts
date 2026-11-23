import { describe, expect, it } from "vitest";
import { analyzeRevocation } from "@/server/research/sponsorship-map/revocationOutcome";
import { mockSponsoredEntries } from "./fixtures";

describe("revocationOutcome", () => {
  it("marks safe when balance is sufficient", async () => {
    const outcome = await analyzeRevocation(mockSponsoredEntries[0], "50000000", 2);
    expect(outcome.outcome).toBe("safe");
  });

  it("marks underfunded when balance is insufficient", async () => {
    const outcome = await analyzeRevocation(mockSponsoredEntries[0], "5000000", 2);
    expect(outcome.outcome).toBe("underfunded");
  });

  it("marks critical when balance is zero", async () => {
    const outcome = await analyzeRevocation(mockSponsoredEntries[0], "0", 2);
    expect(outcome.outcome).toBe("critical");
  });

  it("includes explanation", async () => {
    const outcome = await analyzeRevocation(mockSponsoredEntries[0], "50000000", 2);
    expect(outcome.explanation).toBeDefined();
    expect(outcome.explanation.length).toBeGreaterThan(0);
  });
});
