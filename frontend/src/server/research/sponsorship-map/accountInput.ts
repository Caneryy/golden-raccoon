import type { SponsorshipMapRequest } from "./schema";

export type ValidatedInput = {
  account: string;
  network: "stellar-testnet" | "stellar-pubnet";
};

export function validateAccountInput(input: SponsorshipMapRequest): ValidatedInput {
  const account = input.account.trim();
  
  if (!account.startsWith("G")) {
    throw new Error("Account must be a valid Stellar address starting with G");
  }

  return {
    account,
    network: input.network,
  };
}
