import { StrKey } from "@stellar/stellar-sdk";
import type { TomlFieldIssue } from "./schema";

export function validateFields(raw: Record<string, unknown>): TomlFieldIssue[] {
  const issues: TomlFieldIssue[] = [];

  if (raw.SIGNING_KEY !== undefined && typeof raw.SIGNING_KEY === "string") {
    if (!StrKey.isValidEd25519PublicKey(raw.SIGNING_KEY)) {
      issues.push({
        field: "SIGNING_KEY",
        issue: "malformed",
        value: raw.SIGNING_KEY,
      });
    }
  }

  if (raw.URI_REQUEST_SIGNING_KEY !== undefined && typeof raw.URI_REQUEST_SIGNING_KEY === "string") {
    if (!StrKey.isValidEd25519PublicKey(raw.URI_REQUEST_SIGNING_KEY)) {
      issues.push({
        field: "URI_REQUEST_SIGNING_KEY",
        issue: "malformed",
        value: raw.URI_REQUEST_SIGNING_KEY,
      });
    }
  }

  const urlFields = [
    "FEDERATION_SERVER",
    "AUTH_SERVER",
    "TRANSFER_SERVER",
    "TRANSFER_SERVER_SEP0024",
    "KYC_SERVER",
    "WEB_AUTH_ENDPOINT",
    "HORIZON_URL",
    "DIRECT_PAYMENT_SERVER",
    "ANCHOR_QUOTE_SERVER",
    "ORG_URL",
    "ORG_LOGO",
  ];

  for (const field of urlFields) {
    const value = raw[field];
    if (value !== undefined && typeof value === "string") {
      try {
        new URL(value);
      } catch {
        issues.push({
          field,
          issue: "malformed",
          value,
        });
      }
    }
  }

  return issues;
}
