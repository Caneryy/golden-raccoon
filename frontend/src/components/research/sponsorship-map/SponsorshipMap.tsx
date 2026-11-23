"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { SponsorshipMapReport } from "@/server/research/sponsorship-map/schema";
import { AccountInput } from "./AccountInput";
import { CoverageNotice } from "./CoverageNotice";
import { EntryTable } from "./EntryTable";
import { RevocationPanel } from "./RevocationPanel";
import { SponsorshipGraph } from "./SponsorshipGraph";
import { SponsorshipList } from "./SponsorshipList";
import { useWorkbenchState } from "./useWorkbenchState";

type Network = "stellar-testnet" | "stellar-pubnet";

export function SponsorshipMap({ initialNetwork = "stellar-testnet" }: { initialNetwork?: Network }) {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState<Network>(initialNetwork);
  const networkRef = useRef(network);
  const { view, setView } = useWorkbenchState(network);

  useEffect(() => {
    networkRef.current = network;
  }, [network]);

  async function mapAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedNetwork = network;
    setView({ status: "loading" });

    const response = await fetch("/api/insights/sponsorship-map", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account,
        network: submittedNetwork,
      }),
    });

    const body = (await response.json()) as { report?: SponsorshipMapReport; message?: string; error?: string };
    if (networkRef.current !== submittedNetwork) return;

    if (!body.report) {
      setView({ status: "error", message: body.message ?? body.error ?? "Mapping failed." });
      return;
    }

    setView({ status: "ready", report: body.report });
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        aria-label="Sponsorship map"
        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4 p-4"
        onSubmit={mapAccount}
      >
        <AccountInput
          account={account}
          network={network}
          disabled={view.status === "loading"}
          onAccount={setAccount}
          onNetwork={setNetwork}
        />
        <button
          type="submit"
          disabled={view.status === "loading"}
          className="inline-flex w-fit rounded-full border border-[#d9a441]/35 bg-[#d9a441]/10 px-4 py-2 text-sm font-semibold text-[#f2c86d] disabled:opacity-50"
        >
          Map sponsorships
        </button>
        <p data-testid="sponsorship-map-idle" className="text-sm text-muted">
          This page maps active reserve sponsorships and revocation exposure. It does not build sponsorship transactions.
        </p>
      </form>
      {view.status === "error" ? (
        <p role="alert" className="rounded-2xl border border-red-300/25 bg-red-400/8 p-4 text-sm text-red-100">
          {view.message}
        </p>
      ) : null}
      {view.status === "ready" ? (
        <div className="flex flex-col gap-4">
          <SponsorshipGraph sponsorships={view.report.sponsorships} account={view.report.account} />
          <SponsorshipList sponsorships={view.report.sponsorships} account={view.report.account} />
          <EntryTable sponsorships={view.report.sponsorships} />
          <RevocationPanel outcomes={view.report.revocationOutcomes} />
          <CoverageNotice notice={view.report.coverageNotice} state={view.report.state} />
        </div>
      ) : null}
    </div>
  );
}
