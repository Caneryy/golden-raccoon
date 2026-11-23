"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CurrencyBacklink, AccountBacklink } from "@/server/research/toml-health/schema";

type BacklinkCheckProps = {
  currencyBacklinks: CurrencyBacklink[];
  accountBacklinks: AccountBacklink[];
};

export function BacklinkCheck({ currencyBacklinks, accountBacklinks }: BacklinkCheckProps) {
  const hasCurrencies = currencyBacklinks.length > 0;
  const hasAccounts = accountBacklinks.length > 0;

  if (!hasCurrencies && !hasAccounts) {
    return <p className="text-sm text-muted">No currencies or accounts to check for backlinks</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {hasCurrencies && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Currency Backlinks</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Backlink</TableHead>
                  <TableHead>Ledger Domain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencyBacklinks.map((currency, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">{currency.code}</TableCell>
                    <TableCell className="max-w-xs truncate font-mono text-xs">{currency.issuer}</TableCell>
                    <TableCell>
                      {currency.backlinkMatches ? (
                        <span className="text-green-600">✓ Matches</span>
                      ) : (
                        <span className="text-red-600">✗ Mismatch</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{currency.ledgerHomeDomain ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {hasAccounts && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Account Backlinks</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Backlink</TableHead>
                  <TableHead>Ledger Domain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountBacklinks.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-xs truncate font-mono text-xs">{account.account}</TableCell>
                    <TableCell>
                      {account.backlinkMatches ? (
                        <span className="text-green-600">✓ Matches</span>
                      ) : (
                        <span className="text-red-600">✗ Mismatch</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{account.ledgerHomeDomain ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
