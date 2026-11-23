# Sponsorship Map API

## Endpoint

```
POST /api/insights/sponsorship-map
```

## Request Schema

```typescript
{
  account: string;        // Stellar account address (G...)
  network: "stellar-testnet" | "stellar-pubnet";
}
```

### Example Request

```json
{
  "account": "GABC123...",
  "network": "stellar-testnet"
}
```

## Response Schema

```typescript
{
  report: {
    schemaVersion: number;
    account: string;
    network: string;
    state: "complete" | "partial" | "unavailable";
    numSponsoring: number;
    numSponsored: number;
    sponsorships: Array<{
      sponsor: string;
      sponsored: string;
      entries: Array<{
        id: string;
        type: "trustline" | "offer" | "data" | "signer" | "claimable_balance";
        sponsor: string;
        sponsored: string;
        reserveAmount: string;
      }>;
      totalReserve: string;
    }>;
    revocationOutcomes: Array<{
      entryId: string;
      outcome: "safe" | "underfunded" | "critical";
      requiredBalance: string;
      currentBalance: string;
      explanation: string;
    }>;
    coverageNotice: string;
    baseReserveSource: string;
    readOnly: boolean;
  }
}
```

## Status Codes

- **200**: Success - map generated
- **400**: Bad request - invalid parameters
- **404**: Not found - account does not exist
- **413**: Payload too large
- **429**: Rate limit exceeded
- **503**: Service unavailable - provider temporarily unavailable (Retry-After header set)

## Rate Limiting

- 20 requests per minute per namespace
- Rate limit header: `X-RateLimit-Remaining`

## Error Response

```json
{
  "error": "error_code",
  "message": "Human readable error message"
}
```

### Error Codes

- `invalid_request`: Request validation failed
- `invalid_json`: Request body is not valid JSON
- `payload_too_large`: Request exceeds size limit
- `not_found`: Account not found
- `response_too_large`: Response would exceed size limit
- `timeout`: Request exceeded time limit
- `sponsorship_map_failed`: Internal error
