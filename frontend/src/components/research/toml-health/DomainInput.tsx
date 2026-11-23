"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DomainInputProps = {
  domain: string;
  onDomainChange: (domain: string) => void;
  onAudit: () => void;
  loading: boolean;
};

export function DomainInput({ domain, onDomainChange, onAudit, loading }: DomainInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="domain">Home Domain</Label>
        <Input
          id="domain"
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={(e) => onDomainChange(e.target.value)}
          disabled={loading}
        />
        <p className="text-xs text-muted">Enter the domain that publishes a stellar.toml file</p>
      </div>
      <Button onClick={onAudit} disabled={loading || !domain.trim()}>
        {loading ? "Auditing..." : "Audit stellar.toml"}
      </Button>
    </div>
  );
}
