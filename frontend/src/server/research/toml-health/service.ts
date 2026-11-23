import { coverageNotice } from "./coverage";
import { TomlHealthError, type TomlHealthState } from "./errors";
import { validateDomain } from "./domainInput";
import { fetchStellarToml, type FetchDeps } from "./tomlFetch";
import { parseStellarToml } from "./tomlParser";
import { validateFields } from "./fieldValidation";
import { probeEndpoints, type ProbeDeps } from "./endpointProbe";
import { checkCurrencyBacklinks, type CurrencyDeps } from "./currencyBacklinks";
import { checkAccountBacklinks, type AccountDeps } from "./accountBacklinks";
import { checkHeaders } from "./headerChecks";
import { TOML_HEALTH_SCHEMA_VERSION, tomlHealthRequestSchema, type TomlHealthReport } from "./schema";

export type TomlHealthDeps = {
  fetchDeps?: FetchDeps;
  probeDeps?: ProbeDeps;
  currencyDeps?: CurrencyDeps;
  accountDeps?: AccountDeps;
};

function unavailableReport(domain: string, reason: string): TomlHealthReport {
  return {
    schemaVersion: TOML_HEALTH_SCHEMA_VERSION,
    domain,
    state: "unavailable",
    fetchResult: {
      success: false,
      status: null,
      contentType: null,
      corsHeaders: [],
      sizeBytes: null,
      fetchTimeMs: 0,
      error: reason,
    },
    declarations: [],
    fieldIssues: [],
    endpoints: [],
    currencyBacklinks: [],
    accountBacklinks: [],
    headerFindings: [],
    coverageNotice: coverageNotice("unavailable", domain),
    readOnly: true,
    writesState: false,
  };
}

/**
 * Audit a domain's stellar.toml: fetch, parse, validate fields, probe endpoints, and check backlinks.
 * Never sends authenticated or state-changing requests.
 */
export async function auditTomlHealth(body: unknown, deps: TomlHealthDeps = {}): Promise<TomlHealthReport> {
  const parseResult = tomlHealthRequestSchema.safeParse(body);
  if (!parseResult.success) {
    throw new TomlHealthError("invalid_request", parseResult.error.errors[0]?.message ?? "Invalid request");
  }

  const { domain } = parseResult.data;
  const validatedDomain = validateDomain(domain);

  const fetchResult = await fetchStellarToml(validatedDomain, deps.fetchDeps);

  if (!fetchResult.success) {
    return unavailableReport(validatedDomain, fetchResult.error ?? "Failed to fetch stellar.toml");
  }

  const response = await (deps.fetchDeps?.fetch ?? globalThis.fetch)(`https://${validatedDomain}/.well-known/stellar.toml`);
  const content = await response.text();

  const parseToml = parseStellarToml(content);

  if (!parseToml.success) {
    return {
      schemaVersion: TOML_HEALTH_SCHEMA_VERSION,
      domain: validatedDomain,
      state: "partial",
      fetchResult,
      declarations: [],
      fieldIssues: [],
      endpoints: [],
      currencyBacklinks: [],
      accountBacklinks: [],
      headerFindings: checkHeaders(fetchResult),
      coverageNotice: coverageNotice("partial", validatedDomain),
      readOnly: true,
      writesState: false,
    };
  }

  const fieldIssues = [...parseToml.issues, ...validateFields(parseToml.raw ?? {})];
  const endpoints = await probeEndpoints(parseToml.raw ?? {}, deps.probeDeps);
  const currencyBacklinks = await checkCurrencyBacklinks(validatedDomain, parseToml.raw ?? {}, deps.currencyDeps);
  const accountBacklinks = await checkAccountBacklinks(validatedDomain, parseToml.raw ?? {}, deps.accountDeps);
  const headerFindings = checkHeaders(fetchResult);

  const state: TomlHealthState = "complete";

  return {
    schemaVersion: TOML_HEALTH_SCHEMA_VERSION,
    domain: validatedDomain,
    state,
    fetchResult,
    declarations: parseToml.declarations,
    fieldIssues,
    endpoints,
    currencyBacklinks,
    accountBacklinks,
    headerFindings,
    coverageNotice: coverageNotice(state, validatedDomain),
    readOnly: true,
    writesState: false,
  };
}
