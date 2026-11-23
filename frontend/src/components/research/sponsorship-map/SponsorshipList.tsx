import type { SponsorshipEdge } from "@/server/research/sponsorship-map/schema";

type SponsorshipListProps = {
  sponsorships: SponsorshipEdge[];
  account: string;
};

export function SponsorshipList({ sponsorships, account }: SponsorshipListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <h3 className="mb-4 text-lg font-semibold">Sponsorship List</h3>
      <div className="space-y-2">
        {sponsorships.map((edge, index) => {
          const isSponsor = edge.sponsor === account;
          const role = isSponsor ? "Sponsoring" : "Sponsored by";
          const otherParty = isSponsor ? edge.sponsored : edge.sponsor;
          
          return (
            <div key={index} className="rounded-lg border border-white/5 bg-white/2 p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium">{role}</div>
                  <div className="mt-1 font-mono text-xs text-muted">{otherParty}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{edge.entries.length}</div>
                  <div className="text-xs text-muted">entries</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
