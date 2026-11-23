import { z } from "zod";
import type { TomlHealthState } from "./errors";
import { TOML_HEALTH_LIMITS } from "./limits";

export const TOML_HEALTH_SCHEMA_VERSION = "toml-health/2026-01" as const;

export const tomlHealthRequestSchema = z.object({
  domain: z
    .string()
    .trim()
    .min(1, "Domain is required")
    .max(TOML_HEALTH_LIMITS.maxDomainLength, "Domain too long")
    .refine(
      (value) => {
        const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        return domainPattern.test(value);
      },
      { message: "Invalid domain format" },
    ),
});

export type TomlHealthRequest = z.infer<typeof tomlHealthRequestSchema>;

export type TomlFetchResult = {
  success: boolean;
  status: number | null;
  contentType: string | null;
  corsHeaders: string[];
  sizeBytes: number | null;
  fetchTimeMs: number;
  error: string | null;
};

export type TomlFieldIssue = {
  field: string;
  issue: "unknown" | "duplicated" | "malformed" | "invalid";
  value: unknown;
};

export type EndpointProbeResult = {
  name: string;
  url: string;
  reachable: boolean;
  status: number | null;
  responseTimeMs: number;
  error: string | null;
};

export type CurrencyBacklink = {
  code: string;
  issuer: string;
  backlinkMatches: boolean;
  ledgerHomeDomain: string | null;
  error: string | null;
};

export type AccountBacklink = {
  account: string;
  purpose: string;
  backlinkMatches: boolean;
  ledgerHomeDomain: string | null;
  error: string | null;
};

export type HeaderFinding = {
  header: string;
  value: string | null;
  expected: string | null;
  passes: boolean;
};

export type TomlDeclaration = {
  field: string;
  value: unknown;
};

export type TomlHealthReport = {
  schemaVersion: typeof TOML_HEALTH_SCHEMA_VERSION;
  domain: string;
  state: TomlHealthState;
  fetchResult: TomlFetchResult;
  declarations: TomlDeclaration[];
  fieldIssues: TomlFieldIssue[];
  endpoints: EndpointProbeResult[];
  currencyBacklinks: CurrencyBacklink[];
  accountBacklinks: AccountBacklink[];
  headerFindings: HeaderFinding[];
  coverageNotice: string;
  readOnly: true;
  writesState: false;
};
