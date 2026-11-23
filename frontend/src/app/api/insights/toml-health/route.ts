import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/server/security/rateLimit";
import { TOML_HEALTH_LIMITS, TomlHealthError, auditTomlHealth } from "@/server/research/toml-health";

export const dynamic = "force-dynamic";

const noStore = { "cache-control": "no-store" } as const;

/** Read-only stellar.toml audit. Never writes or sends authenticated requests. */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, { namespace: "toml-health", limit: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > TOML_HEALTH_LIMITS.maxRequestBytes) {
    return NextResponse.json({ error: "payload_too_large", limitBytes: TOML_HEALTH_LIMITS.maxRequestBytes }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: noStore });
  }

  try {
    const report = await auditTomlHealth(body);
    return NextResponse.json(
      { report },
      {
        status: report.state === "unavailable" ? 503 : 200,
        headers: report.state === "unavailable" ? { ...noStore, "Retry-After": "15" } : noStore,
      },
    );
  } catch (error) {
    if (error instanceof TomlHealthError) {
      const status = error.code === "domain_unreachable" ? 503 : error.code === "response_too_large" ? 413 : 400;
      return NextResponse.json({ error: error.code, message: error.message }, { status, headers: noStore });
    }
    return NextResponse.json({ error: "toml_health_audit_failed" }, { status: 500, headers: noStore });
  }
}
