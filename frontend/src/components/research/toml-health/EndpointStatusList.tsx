"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EndpointProbeResult } from "@/server/research/toml-health/schema";

type EndpointStatusListProps = {
  endpoints: EndpointProbeResult[];
};

export function EndpointStatusList({ endpoints }: EndpointStatusListProps) {
  if (endpoints.length === 0) {
    return <p className="text-sm text-muted">No endpoints declared in stellar.toml</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-xs">{endpoint.name}</TableCell>
              <TableCell className="max-w-xs truncate text-xs">{endpoint.url}</TableCell>
              <TableCell>
                {endpoint.reachable ? (
                  <span className="text-green-600">✓ Reachable</span>
                ) : (
                  <span className="text-red-600">✗ Unreachable</span>
                )}
              </TableCell>
              <TableCell className="text-xs">{endpoint.responseTimeMs.toFixed(0)}ms</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
