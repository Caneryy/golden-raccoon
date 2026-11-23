import { describe, it, expect } from "vitest";
import { parseStellarToml } from "@/server/research/toml-health/tomlParser";
import { healthyAnchorToml, malformedToml, unknownFieldsToml } from "./fixtures";

describe("parseStellarToml", () => {
  it("parses valid TOML with known fields", () => {
    const result = parseStellarToml(healthyAnchorToml);
    expect(result.success).toBe(true);
    expect(result.declarations.length).toBeGreaterThan(0);
    expect(result.error).toBeNull();
  });

  it("reports unknown fields", () => {
    const result = parseStellarToml(unknownFieldsToml);
    expect(result.success).toBe(true);
    expect(result.issues.some((issue) => issue.issue === "unknown")).toBe(true);
  });

  it("reports malformed TOML", () => {
    const result = parseStellarToml(malformedToml);
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });
});
