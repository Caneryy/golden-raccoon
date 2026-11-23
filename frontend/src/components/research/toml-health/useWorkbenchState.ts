import { useState } from "react";
import type { TomlHealthReport } from "@/server/research/toml-health";

export function useWorkbenchState() {
  const [domain, setDomain] = useState("");
  const [report, setReport] = useState<TomlHealthReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    domain,
    setDomain,
    report,
    setReport,
    loading,
    setLoading,
    error,
    setError,
  };
}
