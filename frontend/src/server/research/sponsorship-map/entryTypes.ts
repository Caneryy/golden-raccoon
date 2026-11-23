import type { EntryType } from "./schema";

export const ENTRY_TYPE_RESERVES: Record<EntryType, string> = {
  trustline: "5000000", // 0.5 XLM
  offer: "5000000", // 0.5 XLM
  data: "5000000", // 0.5 XLM
  signer: "5000000", // 0.5 XLM
  claimable_balance: "5000000", // 0.5 XLM
};

export function getEntryReserve(type: EntryType): string {
  return ENTRY_TYPE_RESERVES[type];
}

export function isValidEntryType(type: string): type is EntryType {
  return type in ENTRY_TYPE_RESERVES;
}
