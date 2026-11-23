"use client";

import { useState } from "react";
import type { ClawbackHistoryReport } from "@/server/research/clawback-history";

export function ClawbackHistory() {
  const [assetCode, setAssetCode] = useState("");
  const [issuer, setIssuer] = useState("");
  const [report, setReport] = useState<ClawbackHistoryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReconstruct = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/insights/clawback-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetCode, issuer, network: "stellar-pubnet" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? data.error ?? "Failed to reconstruct history");
        return;
      }

      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="assetCode" className="text-sm font-medium">
            Asset Code
          </label>
          <input
            id="assetCode"
            type="text"
            placeholder="USDC"
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
            disabled={loading}
            className="rounded-md border px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="issuer" className="text-sm font-medium">
            Issuer Account
          </label>
          <input
            id="issuer"
            type="text"
            placeholder="G..."
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            disabled={loading}
            className="rounded-md border px-3 py-2 font-mono text-sm"
          />
        </div>
        <button
          onClick={handleReconstruct}
          disabled={loading || !assetCode.trim() || !issuer.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Reconstructing..." : "Reconstruct History"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      {report && (
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">{report.coverageNotice}</p>
          </div>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Asset:</span> {report.assetCode}
              </div>
              <div>
                <span className="text-gray-500">Total Clawed Back:</span> {report.totalClawedBack}
              </div>
              <div>
                <span className="text-gray-500">Clawback Events:</span> {report.clawbackEvents.length}
              </div>
              <div>
                <span className="text-gray-500">Authorization Events:</span> {report.authorizationEvents.length}
              </div>
              <div>
                <span className="text-gray-500">Flag Changes:</span> {report.flagChanges.length}
              </div>
              <div>
                <span className="text-gray-500">Ledger Range:</span> {report.oldestLedger ?? "—"} to {report.newestLedger ?? "—"}
              </div>
            </div>
          </section>

          {report.clawbackEvents.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Clawback Events ({report.clawbackEvents.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ledger</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Account</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {report.clawbackEvents.slice(0, 20).map((event, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-xs">{event.ledger}</td>
                        <td className="max-w-xs truncate px-4 py-2 font-mono text-xs">{event.affectedAccount}</td>
                        <td className="px-4 py-2 text-xs">{event.amount}</td>
                        <td className="max-w-xs truncate px-4 py-2 font-mono text-xs">
                          <a
                            href={`https://stellar.expert/explorer/public/tx/${event.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {event.transactionHash.slice(0, 8)}...
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {report.holderSummaries.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Holder Breakdown ({report.holderSummaries.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Account</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Clawbacks</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Revocations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {report.holderSummaries.slice(0, 20).map((holder, index) => (
                      <tr key={index}>
                        <td className="max-w-xs truncate px-4 py-2 font-mono text-xs">{holder.account}</td>
                        <td className="px-4 py-2 text-xs">{holder.clawbackCount}</td>
                        <td className="px-4 py-2 text-xs">{holder.totalClawedBack}</td>
                        <td className="px-4 py-2 text-xs">{holder.authorizationRevocations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
