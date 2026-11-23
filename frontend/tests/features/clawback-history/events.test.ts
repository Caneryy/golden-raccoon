import { describe, it, expect } from "vitest";
import { extractClawbackEvents } from "@/server/research/clawback-history/clawbackEvents";

describe("extractClawbackEvents", () => {
  it("extracts clawback operations", () => {
    const operations = [
      {
        id: "1",
        type: "clawback",
        ledger: 100,
        created_at: "2024-01-01T00:00:00Z",
        transaction_hash: "hash1",
        source_account: "GISSUER",
        asset_code: "USD",
        asset_issuer: "GISSUER",
        from: "GHOLDER",
        amount: "10.0",
      },
    ];
    const asset = { code: "USD", issuer: "GISSUER" };
    
    const events = extractClawbackEvents(operations, asset);
    expect(events.length).toBe(1);
    expect(events[0]!.amount).toBe("10.0");
  });
});
