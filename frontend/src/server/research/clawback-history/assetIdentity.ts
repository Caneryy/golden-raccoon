import { StrKey } from "@stellar/stellar-sdk";
import { ClawbackHistoryError } from "./errors";

export type AssetIdentity = {
  code: string;
  issuer: string;
};

export function validateAssetIdentity(code: string, issuer: string): AssetIdentity {
  const trimmedCode = code.trim();
  const trimmedIssuer = issuer.trim();

  if (trimmedCode.length === 0) {
    throw new ClawbackHistoryError("invalid_request", "Asset code is required");
  }

  if (trimmedCode.length > 12) {
    throw new ClawbackHistoryError("invalid_request", "Asset code too long");
  }

  if (!StrKey.isValidEd25519PublicKey(trimmedIssuer)) {
    throw new ClawbackHistoryError("invalid_request", "Invalid issuer account");
  }

  return { code: trimmedCode, issuer: trimmedIssuer };
}
