import { Server } from "@stellar/stellar-sdk";
import { TOML_HEALTH_LIMITS } from "./limits";
import type { AccountBacklink } from "./schema";

export type AccountDeps = {
  loadAccount: (server: Server, account: string) => Promise<{ home_domain?: string } | null>;
};

const productionAccount: AccountDeps = {
  loadAccount: async (server: Server, account: string) => {
    try {
      const accountData = await server.loadAccount(account);
      return { home_domain: accountData.home_domain };
    } catch {
      return null;
    }
  },
};

export async function checkAccountBacklinks(
  domain: string,
  raw: Record<string, unknown>,
  deps: AccountDeps = productionAccount,
): Promise<AccountBacklink[]> {
  const accounts = raw.ACCOUNTS;
  if (!Array.isArray(accounts)) {
    return [];
  }

  const server = new Server("https://horizon.stellar.org");
  const results: AccountBacklink[] = [];

  for (const account of accounts.slice(0, TOML_HEALTH_LIMITS.maxAccounts)) {
    if (typeof account === "string") {
      try {
        const accountData = await deps.loadAccount(server, account);
        const ledgerHomeDomain = accountData?.home_domain ?? null;
        const backlinkMatches = ledgerHomeDomain === domain;

        results.push({
          account,
          purpose: "ACCOUNTS",
          backlinkMatches,
          ledgerHomeDomain,
          error: null,
        });
      } catch (error) {
        results.push({
          account,
          purpose: "ACCOUNTS",
          backlinkMatches: false,
          ledgerHomeDomain: null,
          error: error instanceof Error ? error.message : "Failed to load account",
        });
      }
    }
  }

  return results;
}
