export type TomlHealthState = "complete" | "partial" | "unavailable";

export type TomlHealthErrorCode = "invalid_request" | "domain_unreachable" | "response_too_large";

export class TomlHealthError extends Error {
  readonly code: TomlHealthErrorCode;
  readonly details?: unknown;

  constructor(code: TomlHealthErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "TomlHealthError";
    this.code = code;
    this.details = details;
  }
}
