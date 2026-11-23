import type { TomlDeclaration, TomlFieldIssue } from "./schema";

export type ParseResult = {
  success: boolean;
  declarations: TomlDeclaration[];
  issues: TomlFieldIssue[];
  raw: Record<string, unknown> | null;
  error: string | null;
};

const KNOWN_FIELDS = new Set([
  "VERSION",
  "NETWORK_PASSPHRASE",
  "FEDERATION_SERVER",
  "AUTH_SERVER",
  "TRANSFER_SERVER",
  "TRANSFER_SERVER_SEP0024",
  "KYC_SERVER",
  "WEB_AUTH_ENDPOINT",
  "SIGNING_KEY",
  "HORIZON_URL",
  "ACCOUNTS",
  "URI_REQUEST_SIGNING_KEY",
  "DIRECT_PAYMENT_SERVER",
  "ANCHOR_QUOTE_SERVER",
  "CURRENCIES",
  "VALIDATORS",
  "DOCUMENTATION",
  "PRINCIPALS",
  "ORG_NAME",
  "ORG_DBA",
  "ORG_URL",
  "ORG_LOGO",
  "ORG_DESCRIPTION",
  "ORG_PHYSICAL_ADDRESS",
  "ORG_PHYSICAL_ADDRESS_ATTESTATION",
  "ORG_PHONE_NUMBER",
  "ORG_PHONE_NUMBER_ATTESTATION",
  "ORG_KEYBASE",
  "ORG_TWITTER",
  "ORG_GITHUB",
  "ORG_OFFICIAL_EMAIL",
  "ORG_SUPPORT_EMAIL",
  "ORG_LICENSING_AUTHORITY",
  "ORG_LICENSE_TYPE",
  "ORG_LICENSE_NUMBER",
]);

/**
 * Simple line-by-line TOML parser for stellar.toml files.
 * Handles basic key=value pairs and [[CURRENCIES]], [[VALIDATORS]] sections.
 */
export function parseStellarToml(content: string): ParseResult {
  try {
    const declarations: TomlDeclaration[] = [];
    const issues: TomlFieldIssue[] = [];
    const seen = new Set<string>();
    const raw: Record<string, unknown> = {};
    let currentSection: string | null = null;
    const sections: Record<string, unknown[]> = {};

    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      
      if (!line || line.startsWith("#")) continue;

      if (line.startsWith("[[") && line.endsWith("]]")) {
        const sectionName = line.slice(2, -2).trim();
        currentSection = sectionName;
        if (!sections[sectionName]) {
          sections[sectionName] = [];
        }
        sections[sectionName]!.push({});
        continue;
      }

      const match = /^([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;

      const field = match[1]!.trim();
      let value: string | boolean | number = match[2]!.trim();

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      } else if (!isNaN(Number(value))) {
        value = Number(value);
      }

      if (currentSection) {
        const sectionArray = sections[currentSection];
        if (sectionArray && sectionArray.length > 0) {
          const lastItem = sectionArray[sectionArray.length - 1] as Record<string, unknown>;
          lastItem[field] = value;
        }
      } else {
        declarations.push({ field, value });

        if (seen.has(field)) {
          issues.push({
            field,
            issue: "duplicated",
            value,
          });
        }
        seen.add(field);

        if (!KNOWN_FIELDS.has(field) && !field.startsWith("CURRENCY_") && !field.startsWith("VALIDATOR_")) {
          issues.push({
            field,
            issue: "unknown",
            value,
          });
        }

        raw[field] = value;
      }
    }

    for (const [sectionName, sectionArray] of Object.entries(sections)) {
      raw[sectionName] = sectionArray;
      declarations.push({ field: sectionName, value: sectionArray });
    }

    return {
      success: true,
      declarations,
      issues,
      raw,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      declarations: [],
      issues: [],
      raw: null,
      error: error instanceof Error ? error.message : "TOML parse failed",
    };
  }
}
