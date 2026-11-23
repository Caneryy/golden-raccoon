import { describe, it, expect, vi } from "vitest";
import { auditTomlHealth } from "@/server/research/toml-health/service";

describe("auditTomlHealth", () => {
  it("rejects invalid domain", async () => {
    await expect(auditTomlHealth({ domain: "" })).rejects.toThrow();
  });

  it("returns unavailable report for unreachable domain", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const report = await auditTomlHealth(
      { domain: "example.com" },
      { fetchDeps: { fetch: mockFetch } }
    );
    
    expect(report.state).toBe("unavailable");
    expect(report.fetchResult.success).toBe(false);
  });

  it("completes audit for successful fetch", async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([
          ["content-type", "text/plain"],
          ["access-control-allow-origin", "*"],
        ]),
        text: async () => 'VERSION="2.0.0"',
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([
          ["content-type", "text/plain"],
          ["access-control-allow-origin", "*"],
        ]),
        text: async () => 'VERSION="2.0.0"',
      });

    const report = await auditTomlHealth(
      { domain: "example.com" },
      { fetchDeps: { fetch: mockFetch as any } }
    );
    
    expect(report.domain).toBe("example.com");
    expect(report.state).toBe("complete");
  });
});
