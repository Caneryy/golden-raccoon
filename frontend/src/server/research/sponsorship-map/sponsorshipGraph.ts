import type { SponsoredEntry, SponsorshipEdge } from "./schema";

export function buildSponsorshipGraph(entries: SponsoredEntry[]): SponsorshipEdge[] {
  const edgeMap = new Map<string, SponsorshipEdge>();

  for (const entry of entries) {
    const key = `${entry.sponsor}:${entry.sponsored}`;
    
    let edge = edgeMap.get(key);
    if (!edge) {
      edge = {
        sponsor: entry.sponsor,
        sponsored: entry.sponsored,
        entries: [],
        totalReserve: "0",
      };
      edgeMap.set(key, edge);
    }

    edge.entries.push(entry);
    
    // Add up reserve amounts
    const currentTotal = BigInt(edge.totalReserve);
    const entryReserve = BigInt(entry.reserveAmount);
    edge.totalReserve = (currentTotal + entryReserve).toString();
  }

  return Array.from(edgeMap.values());
}
