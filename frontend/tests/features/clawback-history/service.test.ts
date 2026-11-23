import { describe, it, expect } from "vitest";
import { reconstructClawbackHistory } from "@/server/research/clawback-history/service";

describe("reconstructClawbackHistory", () => {
  it("rejects invalid asset code", async () => {
    await expect(reconstructClawbackHistory({ assetCode: "", issuer: "GTEST" })).rejects.toThrow();
  });

  it("rejects invalid issuer", async () => {
    await expect(reconstructClawbackHistory({ assetCode: "USD", issuer: "invalid" })).rejects.toThrow();
  });
});
