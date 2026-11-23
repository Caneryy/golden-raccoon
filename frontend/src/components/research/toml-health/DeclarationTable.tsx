"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TomlDeclaration } from "@/server/research/toml-health/schema";

type DeclarationTableProps = {
  declarations: TomlDeclaration[];
};

export function DeclarationTable({ declarations }: DeclarationTableProps) {
  if (declarations.length === 0) {
    return <p className="text-sm text-muted">No declarations found in stellar.toml</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {declarations.map((declaration, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-xs">{declaration.field}</TableCell>
              <TableCell className="max-w-md truncate text-xs">
                {typeof declaration.value === "string"
                  ? declaration.value
                  : JSON.stringify(declaration.value, null, 2).slice(0, 100)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
