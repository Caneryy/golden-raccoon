import { describe, expect, it } from "vitest";
import { calculateRequiredReserve, hasMinimumBalance, stroopsToXlm } from "@/server/research/sponsorship-map/reserveMath";

describe("reserveMath", () => {
  it("calculates required reserve", () => {
    const required = calculateRequiredReserve(2);
    expect(required).toBe("20000000"); // 1 XLM base + 2 * 0.5 XLM
  });

  it("checks minimum balance", () => {
    expect(hasMinimumBalance("30000000", 2)).toBe(true);
    expect(hasMinimumBalance("15000000", 2)).toBe(false);
  });

  it("converts stroops to XLM", () => {
    expect(stroopsToXlm("10000000")).toBe("1.0000000");
    expect(stroopsToXlm("15000000")).toBe("1.5000000");
  });
});
