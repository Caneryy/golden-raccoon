"use client";

import { useState } from "react";
import type { TomlHealthReport as TomlHealthReportType } from "@/server/research/toml-health";

export function TomlHealthReport() {
  const [domain, setDomain] = useState("");
  const [report, setReport] = useState<TomlHealthReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/insights/toml-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? data.error ?? "Failed to audit stellar.toml");
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
          <label htmlFor="domain" className="text-sm font-medium">
            Home Domain
          </label>
          <input
            id="domain"
            type="text"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
            className="rounded-md border px-3 py-2"
          />
          <p className="text-xs text-gray-500">Enter the domain that publishes a stellar.toml file</p>
        </div>
        <button
          onClick={handleAudit}
          disabled={loading || !domain.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Auditing..." : "Audit stellar.toml"}
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
            <h2 className="mb-4 text-lg font-semibold">Fetch Result</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Status:</span>{" "}
                <span className={report.fetchResult.success ? "text-green-600" : "text-red-600"}>
                  {report.fetchResult.success ? "Success" : "Failed"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">HTTP Status:</span> {report.fetchResult.status ?? "—"}
              </div>
              <div>
                <span className="text-gray-500">Content Type:</span> {report.fetchResult.contentType ?? "—"}
              </div>
              <div>
                <span className="text-gray-500">Size:</span> {report.fetchResult.sizeBytes ?? "—"} bytes
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Declarations ({report.declarations.length})</h2>
            {report.declarations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Field</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {report.declarations.slice(0, 20).map((declaration, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-mono text-xs">{declaration.field}</td>
                        <td className="max-w-md truncate px-4 py-2 text-xs">
                          {typeof declaration.value === "string"
                            ? declaration.value
                            : JSON.stringify(declaration.value).slice(0, 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No declarations found</p>
            )}
          </section>

          {report.endpoints.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Endpoints ({report.endpoints.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Endpoint</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {report.endpoints.map((endpoint, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-mono text-xs">{endpoint.name}</td>
                        <td className="px-4 py-2">
                          {endpoint.reachable ? (
                            <span className="text-green-600">✓ Reachable</span>
                          ) : (
                            <span className="text-red-600">✗ Unreachable</span>
                          )}
                        </td>
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
