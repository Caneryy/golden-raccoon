import Link from "next/link";
import { ClawbackHistory } from "@/components/research/clawback-history/ClawbackHistory";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clawback History",
  description: "Reconstruct clawback and authorization-revocation history for an asset.",
};

export default async function ClawbackHistoryPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Golden Raccoon · Insights</p>
        <h1 className="text-3xl font-semibold">Clawback History</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Reconstruct the history of clawback operations, authorization changes, and flag modifications for an issued asset.
          Every event links to its source transaction. Gaps in provider history are marked and excluded from totals.
        </p>
        <p className="text-xs text-gray-500">
          <Link href="/dashboard" className="underline underline-offset-2">
            Back to dashboard
          </Link>
        </p>
      </header>
      <ClawbackHistory />
    </main>
  );
}
