# Stellar.toml Health API

## Endpoint

```
POST /api/insights/toml-health
```

## Request Schema

```typescript
{
  domain: string; // Home domain (e.g., "example.com")
}
```

### Validation
- `domain`: Required, 1-253 characters, valid domain format

### Example Request

```json
{
  "domain": "stellar.example.com"
}
```

## Response Schema

```typescript
{
  report: {
    schemaVersion: "toml-health/2026-01";
    domain: string;
    state: "complete" | "partial" | "unavailable";
    fetchResult: {
      success: boolean;
      status: number | null;
      contentType: string | null;
      corsHeaders: string[];
      sizeBytes: number | null;
      fetchTimeMs: number;
      error: string | null;
    };
    declarations: Array<{
      field: string;
      value: unknown;
    }>;
    fieldIssues: Array<{
      field: string;
      issue: "unknown" | "duplicated" | "malformed" | "invalid";
      value: unknown;
    }>;
    endpoints: Array<{
      name: string;
      url: string;
      reachable: boolean;
      status: number | null;
      responseTimeMs: number;
      error: string | null;
    }>;
    currencyBacklinks: Array<{
      code: string;
      issuer: string;
      backlinkMatches: boolean;
      ledgerHomeDomain: string | null;
      error: string | null;
    }>;
    accountBacklinks: Array<{
      account: string;
      purpose: string;
      backlinkMatches: boolean;
      ledgerHomeDomain: string | null;
      error: string | null;
    }>;
    headerFindings: Array<{
      header: string;
      value: string | null;
      expected: string | null;
      passes: boolean;
    }>;
    coverageNotice: string;
    readOnly: true;
    writesState: false;
  };
}
```

## Status Codes

- `200`: Audit completed (state may be "complete" or "partial")
- `400`: Invalid request (malformed domain or JSON)
- `413`: Payload too large
- `429`: Rate limit exceeded
- `503`: Service unavailable (domain unreachable, state "unavailable")

## Error Response

```typescript
{
  error: string;
  message?: string;
  limitBytes?: number;
}
```

### Error Codes
- `invalid_json`: Request body is not valid JSON
- `invalid_request`: Invalid domain format
- `domain_unreachable`: Cannot fetch stellar.toml
- `response_too_large`: TOML file exceeds size limit
- `payload_too_large`: Request payload exceeds limit
- `toml_health_audit_failed`: Internal error

## Rate Limiting

- Namespace: `toml-health`
- Limit: 10 requests per 60 seconds
- Header: `Retry-After` on 429 response

## Example Response

```json
{
  "report": {
    "schemaVersion": "toml-health/2026-01",
    "domain": "stellar.example.com",
    "state": "complete",
    "fetchResult": {
      "success": true,
      "status": 200,
      "contentType": "text/plain",
      "corsHeaders": ["access-control-allow-origin: *"],
      "sizeBytes": 1234,
      "fetchTimeMs": 234,
      "error": null
    },
    "declarations": [
      { "field": "VERSION", "value": "2.0.0" },
      { "field": "FEDERATION_SERVER", "value": "https://api.stellar.example.com/federation" }
    ],
    "fieldIssues": [],
    "endpoints": [
      {
        "name": "FEDERATION_SERVER",
        "url": "https://api.stellar.example.com/federation",
        "reachable": true,
        "status": 200,
        "responseTimeMs": 123,
        "error": null
      }
    ],
    "currencyBacklinks": [],
    "accountBacklinks": [],
    "headerFindings": [
      {
        "header": "content-type",
        "value": "text/plain",
        "expected": "text/plain or application/toml",
        "passes": true
      }
    ],
    "coverageNotice": "Read-only audit of stellar.example.com's stellar.toml...",
    "readOnly": true,
    "writesState": false
  }
}
```
