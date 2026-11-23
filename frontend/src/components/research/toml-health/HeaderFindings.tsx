"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { HeaderFinding } from "@/server/research/toml-health/schema";

type HeaderFindingsProps = {
  findings: HeaderFinding[];
};

export function HeaderFindings({ findings }: HeaderFindingsProps) {
  if (findings.length === 0) {
    return <p className="text-sm text-muted">No header findings</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {findings.map((finding, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-xs">{finding.header}</TableCell>
              <TableCell className="max-w-xs truncate text-xs">{finding.value ?? "—"}</TableCell>
              <TableCell className="text-xs">{finding.expected}</TableCell>
              <TableCell>
                {finding.passes ? <span className="text-green-600">✓ Pass</span> : <span className="text-red-600">✗ Fail</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
