const BASE_RESERVE = 5_000_000n; // 0.5 XLM in stroops
const MIN_ACCOUNT_BALANCE = 10_000_000n; // 1 XLM (2 * base reserve)

export function calculateRequiredReserve(numEntries: number): string {
  return (MIN_ACCOUNT_BALANCE + BASE_RESERVE * BigInt(numEntries)).toString();
}

export function calculateRemainingReserve(currentBalance: string, numEntries: number): string {
  const balance = BigInt(currentBalance);
  const required = BigInt(calculateRequiredReserve(numEntries));
  const remaining = balance - required;
  return remaining.toString();
}

export function hasMinimumBalance(balance: string, numEntries: number): boolean {
  const balanceBig = BigInt(balance);
  const required = BigInt(calculateRequiredReserve(numEntries));
  return balanceBig >= required;
}

export function stroopsToXlm(stroops: string): string {
  const value = BigInt(stroops);
  const xlm = Number(value) / 10_000_000;
  return xlm.toFixed(7);
}
