export const TOML_HEALTH_LIMITS = {
  maxDomainLength: 253,
  maxTomlSize: 100_000,
  fetchTimeoutMs: 8_000,
  endpointProbeTimeoutMs: 5_000,
  maxEndpoints: 20,
  maxCurrencies: 50,
  maxAccounts: 20,
  maxRequestBytes: 4_096,
  maxResponseBytes: 1_000_000,
} as const;
