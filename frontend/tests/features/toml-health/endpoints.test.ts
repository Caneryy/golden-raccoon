import { describe, it, expect, vi } from "vitest";
import { probeEndpoint } from "@/server/research/toml-health/endpointProbe";

describe("probeEndpoint", () => {
  it("reports reachable endpoint", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    const result = await probeEndpoint("WEB_AUTH_ENDPOINT", "https://example.com/auth", { fetch: mockFetch });
    
    expect(result.reachable).toBe(true);
    expect(result.status).toBe(200);
    expect(result.error).toBeNull();
  });

  it("reports unreachable endpoint", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const result = await probeEndpoint("WEB_AUTH_ENDPOINT", "https://example.com/auth", { fetch: mockFetch });
    
    expect(result.reachable).toBe(false);
    expect(result.status).toBe(404);
    expect(result.error).toContain("404");
  });

  it("handles network errors", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const result = await probeEndpoint("WEB_AUTH_ENDPOINT", "https://example.com/auth", { fetch: mockFetch });
    
    expect(result.reachable).toBe(false);
    expect(result.error).toContain("Network error");
  });
});
