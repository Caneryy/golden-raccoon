export type ClawbackHistoryState = "complete" | "partial" | "unavailable";

export type ClawbackHistoryErrorCode = "invalid_request" | "asset_not_found" | "response_too_large";

export class ClawbackHistoryError extends Error {
  readonly code: ClawbackHistoryErrorCode;
  readonly details?: unknown;

  constructor(code: ClawbackHistoryErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ClawbackHistoryError";
    this.code = code;
    this.details = details;
  }
}
