import { Server } from "@stellar/stellar-sdk";
import { TOML_HEALTH_LIMITS } from "./limits";
import type { CurrencyBacklink } from "./schema";

export type CurrencyDeps = {
  loadAccount: (server: Server, issuer: string) => Promise<{ home_domain?: string } | null>;
};

const productionCurrency: CurrencyDeps = {
  loadAccount: async (server: Server, issuer: string) => {
    try {
      const account = await server.loadAccount(issuer);
      return { home_domain: account.home_domain };
    } catch {
      return null;
    }
  },
};

export async function checkCurrencyBacklinks(
  domain: string,
  raw: Record<string, unknown>,
  deps: CurrencyDeps = productionCurrency,
): Promise<CurrencyBacklink[]> {
  const currencies = raw.CURRENCIES;
  if (!Array.isArray(currencies)) {
    return [];
  }

  const server = new Server("https://horizon.stellar.org");
  const results: CurrencyBacklink[] = [];

  for (const currency of currencies.slice(0, TOML_HEALTH_LIMITS.maxCurrencies)) {
    if (typeof currency === "object" && currency !== null) {
      const currencyObj = currency as Record<string, unknown>;
      const code = currencyObj.code;
      const issuer = currencyObj.issuer;

      if (typeof code === "string" && typeof issuer === "string") {
        try {
          const account = await deps.loadAccount(server, issuer);
          const ledgerHomeDomain = account?.home_domain ?? null;
          const backlinkMatches = ledgerHomeDomain === domain;

          results.push({
            code,
            issuer,
            backlinkMatches,
            ledgerHomeDomain,
            error: null,
          });
        } catch (error) {
          results.push({
            code,
            issuer,
            backlinkMatches: false,
            ledgerHomeDomain: null,
            error: error instanceof Error ? error.message : "Failed to load account",
          });
        }
      }
    }
  }

  return results;
}
