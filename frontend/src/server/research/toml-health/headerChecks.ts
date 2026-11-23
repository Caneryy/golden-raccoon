import type { HeaderFinding, TomlFetchResult } from "./schema";

export function checkHeaders(fetchResult: TomlFetchResult): HeaderFinding[] {
  const findings: HeaderFinding[] = [];

  findings.push({
    header: "content-type",
    value: fetchResult.contentType,
    expected: "text/plain or application/toml",
    passes:
      fetchResult.contentType !== null &&
      (fetchResult.contentType.includes("text/plain") || fetchResult.contentType.includes("application/toml")),
  });

  const hasCors = fetchResult.corsHeaders.some((header) => header.startsWith("access-control-allow-origin"));
  findings.push({
    header: "access-control-allow-origin",
    value: hasCors ? fetchResult.corsHeaders.find((h) => h.startsWith("access-control-allow-origin")) ?? null : null,
    expected: "* or specific origin",
    passes: hasCors,
  });

  return findings;
}
