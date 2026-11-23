import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/insights/sponsorship-map/route";
import { NextRequest } from "next/server";

describe("route", () => {
  it("rejects invalid JSON", async () => {
    const request = new NextRequest("http://localhost/api/insights/sponsorship-map", {
      method: "POST",
      body: "invalid json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rejects payload too large", async () => {
    const request = new NextRequest("http://localhost/api/insights/sponsorship-map", {
      method: "POST",
      headers: { "content-length": "999999" },
      body: "{}",
    });
    const response = await POST(request);
    expect(response.status).toBe(413);
  });

  it("processes valid request", async () => {
    const body = JSON.stringify({
      account: "GABC123",
      network: "stellar-testnet",
    });
    const request = new NextRequest("http://localhost/api/insights/sponsorship-map", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    const response = await POST(request);
    expect(response.status).toMatch(/200|503/);
  });
});
