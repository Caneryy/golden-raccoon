import type { SponsorshipEdge } from "@/server/research/sponsorship-map/schema";

type SponsorshipGraphProps = {
  sponsorships: SponsorshipEdge[];
  account: string;
};

export function SponsorshipGraph({ sponsorships, account }: SponsorshipGraphProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <h3 className="mb-4 text-lg font-semibold">Sponsorship Graph</h3>
      <div className="space-y-3">
        {sponsorships.map((edge, index) => {
          const isSponsor = edge.sponsor === account;
          const otherParty = isSponsor ? edge.sponsored : edge.sponsor;
          const direction = isSponsor ? "→" : "←";
          
          return (
            <div key={index} className="rounded-lg border border-white/5 bg-white/2 p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono">{account.slice(0, 8)}...</span>
                <span className="text-muted">{direction}</span>
                <span className="font-mono">{otherParty.slice(0, 8)}...</span>
              </div>
              <div className="mt-2 text-xs text-muted">
                {edge.entries.length} {edge.entries.length === 1 ? "entry" : "entries"} · 
                Total reserve: {(Number(edge.totalReserve) / 10_000_000).toFixed(7)} XLM
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
