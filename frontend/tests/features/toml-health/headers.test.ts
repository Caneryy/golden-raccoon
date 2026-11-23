import { describe, it, expect } from "vitest";
import { checkHeaders } from "@/server/research/toml-health/headerChecks";

describe("checkHeaders", () => {
  it("passes with correct content-type", () => {
    const fetchResult = {
      success: true,
      status: 200,
      contentType: "text/plain",
      corsHeaders: ["access-control-allow-origin: *"],
      sizeBytes: 100,
      fetchTimeMs: 50,
      error: null,
    };
    
    const findings = checkHeaders(fetchResult);
    const contentTypeFinding = findings.find((f) => f.header === "content-type");
    expect(contentTypeFinding?.passes).toBe(true);
  });

  it("passes with CORS headers", () => {
    const fetchResult = {
      success: true,
      status: 200,
      contentType: "text/plain",
      corsHeaders: ["access-control-allow-origin: *"],
      sizeBytes: 100,
      fetchTimeMs: 50,
      error: null,
    };
    
    const findings = checkHeaders(fetchResult);
    const corsFinding = findings.find((f) => f.header === "access-control-allow-origin");
    expect(corsFinding?.passes).toBe(true);
  });

  it("fails without CORS headers", () => {
    const fetchResult = {
      success: true,
      status: 200,
      contentType: "text/plain",
      corsHeaders: [],
      sizeBytes: 100,
      fetchTimeMs: 50,
      error: null,
    };
    
    const findings = checkHeaders(fetchResult);
    const corsFinding = findings.find((f) => f.header === "access-control-allow-origin");
    expect(corsFinding?.passes).toBe(false);
  });
});
