import { Server } from "@stellar/stellar-sdk";
import { CLAWBACK_HISTORY_LIMITS } from "./limits";
import type { AssetIdentity } from "./assetIdentity";

export type Operation = {
  id: string;
  type: string;
  ledger: number;
  created_at: string;
  transaction_hash: string;
  source_account: string;
  asset_code?: string;
  asset_issuer?: string;
  from?: string;
  amount?: string;
  trustor?: string;
  authorize?: boolean;
  set_flags?: number[];
  clear_flags?: number[];
};

export type OperationDeps = {
  fetchOperations: (server: Server, issuer: string) => Promise<Operation[]>;
};

const productionOperations: OperationDeps = {
  fetchOperations: async (server: Server, issuer: string) => {
    const operations: Operation[] = [];
    let page = await server.operations().forAccount(issuer).limit(200).call();
    
    for (let i = 0; i < 5 && operations.length < CLAWBACK_HISTORY_LIMITS.maxOperations; i++) {
      operations.push(...(page.records as Operation[]));
      if (page.records.length < 200) break;
      page = await page.next();
    }

    return operations.slice(0, CLAWBACK_HISTORY_LIMITS.maxOperations);
  },
};

export async function readOperations(
  asset: AssetIdentity,
  network: string,
  deps: OperationDeps = productionOperations,
): Promise<Operation[]> {
  const horizonUrl = network === "stellar-testnet" 
    ? "https://horizon-testnet.stellar.org"
    : "https://horizon.stellar.org";
  
  const server = new Server(horizonUrl);
  return deps.fetchOperations(server, asset.issuer);
}
