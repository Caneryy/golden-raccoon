import type { RevocationOutcome } from "@/server/research/sponsorship-map/schema";

type RevocationPanelProps = {
  outcomes: RevocationOutcome[];
};

export function RevocationPanel({ outcomes }: RevocationPanelProps) {
  if (outcomes.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
        <h3 className="mb-4 text-lg font-semibold">Revocation Analysis</h3>
        <p className="text-sm text-muted">No sponsored entries to analyze.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <h3 className="mb-4 text-lg font-semibold">Revocation Analysis</h3>
      <div className="space-y-3">
        {outcomes.map((outcome, index) => {
          const colorClass =
            outcome.outcome === "safe"
              ? "border-green-300/25 bg-green-400/8"
              : outcome.outcome === "underfunded"
                ? "border-yellow-300/25 bg-yellow-400/8"
                : "border-red-300/25 bg-red-400/8";

          return (
            <div key={index} className={`rounded-lg border p-3 ${colorClass}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">{outcome.outcome}</div>
                  <div className="mt-1 text-xs text-muted">{outcome.explanation}</div>
                  <div className="mt-2 font-mono text-xs">
                    Current: {(Number(outcome.currentBalance) / 10_000_000).toFixed(7)} XLM
                    <br />
                    Required: {(Number(outcome.requiredBalance) / 10_000_000).toFixed(7)} XLM
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
