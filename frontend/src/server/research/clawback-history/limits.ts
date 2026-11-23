export const CLAWBACK_HISTORY_LIMITS = {
  maxOperations: 1_000,
  maxHolders: 100,
  fetchTimeoutMs: 10_000,
  maxRequestBytes: 4_096,
  maxResponseBytes: 1_000_000,
} as const;
