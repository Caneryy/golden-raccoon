import type { SponsorshipEdge } from "@/server/research/sponsorship-map/schema";

type EntryTableProps = {
  sponsorships: SponsorshipEdge[];
};

export function EntryTable({ sponsorships }: EntryTableProps) {
  const allEntries = sponsorships.flatMap((edge) => edge.entries);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <h3 className="mb-4 text-lg font-semibold">Entry Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2 text-left font-medium text-muted">Type</th>
              <th className="pb-2 text-left font-medium text-muted">Sponsor</th>
              <th className="pb-2 text-left font-medium text-muted">Sponsored</th>
              <th className="pb-2 text-right font-medium text-muted">Reserve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {allEntries.map((entry, index) => (
              <tr key={index}>
                <td className="py-2 capitalize">{entry.type.replace("_", " ")}</td>
                <td className="py-2 font-mono text-xs">{entry.sponsor.slice(0, 12)}...</td>
                <td className="py-2 font-mono text-xs">{entry.sponsored.slice(0, 12)}...</td>
                <td className="py-2 text-right font-mono text-xs">
                  {(Number(entry.reserveAmount) / 10_000_000).toFixed(7)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
