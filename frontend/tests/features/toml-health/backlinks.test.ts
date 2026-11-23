import { describe, it, expect, vi } from "vitest";
import { checkCurrencyBacklinks } from "@/server/research/toml-health/currencyBacklinks";
import { checkAccountBacklinks } from "@/server/research/toml-health/accountBacklinks";

describe("checkCurrencyBacklinks", () => {
  it("reports matching backlinks", async () => {
    const mockLoadAccount = vi.fn().mockResolvedValue({ home_domain: "example.com" });
    const raw = {
      CURRENCIES: [{ code: "USD", issuer: "GTEST..." }],
    };
    
    const results = await checkCurrencyBacklinks("example.com", raw, { loadAccount: mockLoadAccount });
    expect(results[0]?.backlinkMatches).toBe(true);
  });

  it("reports mismatched backlinks", async () => {
    const mockLoadAccount = vi.fn().mockResolvedValue({ home_domain: "other.com" });
    const raw = {
      CURRENCIES: [{ code: "USD", issuer: "GTEST..." }],
    };
    
    const results = await checkCurrencyBacklinks("example.com", raw, { loadAccount: mockLoadAccount });
    expect(results[0]?.backlinkMatches).toBe(false);
  });
});

describe("checkAccountBacklinks", () => {
  it("reports matching backlinks", async () => {
    const mockLoadAccount = vi.fn().mockResolvedValue({ home_domain: "example.com" });
    const raw = {
      ACCOUNTS: ["GTEST..."],
    };
    
    const results = await checkAccountBacklinks("example.com", raw, { loadAccount: mockLoadAccount });
    expect(results[0]?.backlinkMatches).toBe(true);
  });
});
