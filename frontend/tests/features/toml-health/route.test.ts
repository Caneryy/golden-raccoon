import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/insights/toml-health/route";
import { NextRequest } from "next/server";

vi.mock("@/server/security/rateLimit", () => ({
  checkRateLimit: () => null,
}));

vi.mock("@/server/research/toml-health", () => ({
  TOML_HEALTH_LIMITS: { maxRequestBytes: 4096 },
  TomlHealthError: class extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
  auditTomlHealth: vi.fn().mockResolvedValue({
    state: "complete",
    domain: "example.com",
  }),
}));

describe("POST /api/insights/toml-health", () => {
  it("rejects invalid JSON", async () => {
    const request = new NextRequest("http://localhost/api/insights/toml-health", {
      method: "POST",
      body: "invalid json",
    });
    
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns report for valid request", async () => {
    const request = new NextRequest("http://localhost/api/insights/toml-health", {
      method: "POST",
      body: JSON.stringify({ domain: "example.com" }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.report).toBeDefined();
  });
});
