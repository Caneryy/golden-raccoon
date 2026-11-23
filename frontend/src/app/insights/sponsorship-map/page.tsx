import Link from "next/link";
import { SponsorshipMap } from "@/components/research/sponsorship-map/SponsorshipMap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sponsorship Map",
  description: "Map active reserve sponsorships and revocation exposure for an account.",
};

export default async function SponsorshipMapPage({ searchParams }: { searchParams: Promise<{ network?: string }> }) {
  const params = await searchParams;
  const initialNetwork = params.network === "stellar-pubnet" ? "stellar-pubnet" : "stellar-testnet";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">Golden Raccoon · Insights</p>
        <h1 className="text-3xl font-semibold">Sponsorship Map</h1>
        <p className="max-w-3xl text-sm text-muted">
          This page maps every ledger entry an account sponsors or is sponsored for, and what would happen to each if
          the sponsorship were revoked. Reads num_sponsoring and num_sponsored with the sponsored entries (trustlines,
          offers, data, signers, claimable balances) through existing providers. Builds a sponsor-to-sponsored graph
          with entry types and reserve amounts. For each sponsored entry, explains the result of revoke_sponsorship
          given the sponsored account's current balance. Flags accounts that would drop below minimum balance if a
          sponsor revoked. Building or submitting sponsorship transactions is out of scope.
        </p>
        <p className="text-xs text-subtle">
          <Link href="/dashboard" className="underline underline-offset-2">
            Back to dashboard
          </Link>
        </p>
      </header>
      <SponsorshipMap initialNetwork={initialNetwork} />
    </main>
  );
}
