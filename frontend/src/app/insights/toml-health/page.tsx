import Link from "next/link";
import { TomlHealthReport } from "@/components/research/toml-health/TomlHealthReport";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stellar.toml Health",
  description: "Audit stellar.toml publication health and SEP endpoint reachability.",
};

export default async function TomlHealthPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Golden Raccoon · Insights</p>
        <h1 className="text-3xl font-semibold">Stellar.toml Health</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Audit a home domain&apos;s stellar.toml file: fetch status, CORS headers, declared endpoints, and backlink
          verification. All probes are read-only GET requests. Backlink checks query the public ledger. A passing result does
          not prove the anchor is trustworthy or compliant.
        </p>
        <p className="text-xs text-gray-500">
          <Link href="/dashboard" className="underline underline-offset-2">
            Back to dashboard
          </Link>
        </p>
      </header>
      <TomlHealthReport />
    </main>
  );
}
