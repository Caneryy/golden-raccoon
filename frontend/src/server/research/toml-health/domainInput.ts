import { TomlHealthError } from "./errors";
import { TOML_HEALTH_LIMITS } from "./limits";

export function validateDomain(domain: string): string {
  const trimmed = domain.trim();

  if (trimmed.length === 0) {
    throw new TomlHealthError("invalid_request", "Domain is required");
  }

  if (trimmed.length > TOML_HEALTH_LIMITS.maxDomainLength) {
    throw new TomlHealthError("invalid_request", `Domain exceeds ${TOML_HEALTH_LIMITS.maxDomainLength} characters`);
  }

  const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainPattern.test(trimmed)) {
    throw new TomlHealthError("invalid_request", "Invalid domain format");
  }

  return trimmed;
}
