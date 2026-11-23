import { TOML_HEALTH_LIMITS } from "./limits";
import type { TomlFetchResult } from "./schema";

export type FetchDeps = {
  fetch: typeof fetch;
};

const productionFetch: FetchDeps = {
  fetch: globalThis.fetch,
};

export async function fetchStellarToml(domain: string, deps: FetchDeps = productionFetch): Promise<TomlFetchResult> {
  const url = `https://${domain}/.well-known/stellar.toml`;
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TOML_HEALTH_LIMITS.fetchTimeoutMs);

    const response = await deps.fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "text/plain, application/toml, */*",
      },
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    const corsHeaders: string[] = [];
    
    const accessControlAllowOrigin = response.headers.get("access-control-allow-origin");
    if (accessControlAllowOrigin) {
      corsHeaders.push(`access-control-allow-origin: ${accessControlAllowOrigin}`);
    }

    const accessControlAllowMethods = response.headers.get("access-control-allow-methods");
    if (accessControlAllowMethods) {
      corsHeaders.push(`access-control-allow-methods: ${accessControlAllowMethods}`);
    }

    const text = await response.text();
    const sizeBytes = new TextEncoder().encode(text).length;

    if (sizeBytes > TOML_HEALTH_LIMITS.maxTomlSize) {
      return {
        success: false,
        status: response.status,
        contentType,
        corsHeaders,
        sizeBytes,
        fetchTimeMs: performance.now() - startTime,
        error: `Response size ${sizeBytes} exceeds limit ${TOML_HEALTH_LIMITS.maxTomlSize}`,
      };
    }

    return {
      success: response.ok,
      status: response.status,
      contentType,
      corsHeaders,
      sizeBytes,
      fetchTimeMs: performance.now() - startTime,
      error: response.ok ? null : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      status: null,
      contentType: null,
      corsHeaders: [],
      sizeBytes: null,
      fetchTimeMs: performance.now() - startTime,
      error: error instanceof Error ? error.message : "Fetch failed",
    };
  }
}
