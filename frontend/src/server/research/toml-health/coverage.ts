import type { TomlHealthState } from "./errors";

export function coverageNotice(state: TomlHealthState, domain: string | null): string {
  if (state === "unavailable") {
    return "No data available. The domain may be unreachable or the stellar.toml file may be missing.";
  }

  if (state === "partial") {
    return `Partial data for ${domain ?? "domain"}. Some checks could not be completed due to timeouts or rate limits.`;
  }

  return `Read-only audit of ${domain ?? "domain"}'s stellar.toml. Endpoint probes are non-authenticated GET requests. Backlink checks query the public ledger. A passing result does not prove the anchor is trustworthy or compliant.`;
}
