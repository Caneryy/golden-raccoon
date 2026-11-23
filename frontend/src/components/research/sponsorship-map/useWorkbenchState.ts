import { useState } from "react";
import type { SponsorshipMapReport } from "@/server/research/sponsorship-map/schema";

export type WorkbenchView =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; report: SponsorshipMapReport };

export function useWorkbenchState(network: string) {
  const [view, setView] = useState<WorkbenchView>({ status: "idle" });

  return { view, setView };
}
