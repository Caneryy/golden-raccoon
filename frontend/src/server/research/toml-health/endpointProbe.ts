import { TOML_HEALTH_LIMITS } from "./limits";
import type { EndpointProbeResult } from "./schema";

export type ProbeDeps = {
  fetch: typeof fetch;
};

const productionProbe: ProbeDeps = {
  fetch: globalThis.fetch,
};

const ENDPOINT_FIELDS: Record<string, string> = {
  WEB_AUTH_ENDPOINT: "WEB_AUTH_ENDPOINT",
  TRANSFER_SERVER: "TRANSFER_SERVER",
  TRANSFER_SERVER_SEP0024: "TRANSFER_SERVER_SEP0024",
  KYC_SERVER: "KYC_SERVER",
  DIRECT_PAYMENT_SERVER: "DIRECT_PAYMENT_SERVER",
  FEDERATION_SERVER: "FEDERATION_SERVER",
};

export async function probeEndpoint(
  name: string,
  url: string,
  deps: ProbeDeps = productionProbe,
): Promise<EndpointProbeResult> {
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TOML_HEALTH_LIMITS.endpointProbeTimeoutMs);

    const response = await deps.fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    return {
      name,
      url,
      reachable: response.ok,
      status: response.status,
      responseTimeMs: performance.now() - startTime,
      error: response.ok ? null : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      name,
      url,
      reachable: false,
      status: null,
      responseTimeMs: performance.now() - startTime,
      error: error instanceof Error ? error.message : "Probe failed",
    };
  }
}

export async function probeEndpoints(raw: Record<string, unknown>, deps: ProbeDeps = productionProbe): Promise<EndpointProbeResult[]> {
  const endpoints: Array<{ name: string; url: string }> = [];

  for (const [field, fieldName] of Object.entries(ENDPOINT_FIELDS)) {
    const value = raw[field];
    if (typeof value === "string") {
      endpoints.push({ name: fieldName, url: value });
    }
  }

  if (endpoints.length > TOML_HEALTH_LIMITS.maxEndpoints) {
    endpoints.splice(TOML_HEALTH_LIMITS.maxEndpoints);
  }

  return Promise.all(endpoints.map((endpoint) => probeEndpoint(endpoint.name, endpoint.url, deps)));
}
