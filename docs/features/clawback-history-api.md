# Clawback History API

## Endpoint

```
POST /api/insights/clawback-history
```

## Request Schema

```json
{
  "assetCode": "USD",
  "issuer": "G...",
  "network": "stellar-pubnet"
}
```

## Response Schema

```json
{
  "report": {
    "schemaVersion": "clawback-history/2026-01",
    "assetCode": "string",
    "issuer": "string",
    "network": "string",
    "state": "complete" | "partial" | "unavailable",
    "clawbackEvents": Array<{ ledger: number, timestamp: string, operation: string, affectedAccount: string, amount: string, transactionHash: string }>,
    "authorizationEvents": Array<{ ledger: number, timestamp: string, operation: string, affectedAccount: string, authorized: boolean, transactionHash: string }>,
    "flagChanges": Array<{ ledger: number, timestamp: string, operation: string, flag: string, enabled: boolean, transactionHash: string }>,
    "holderSummaries": Array<{ account: string, clawbackCount: number, totalClawedBack: string, authorizationRevocations: number }>,
    "totalClawedBack": "string",
    "retentionGaps": Array<{ startLedger: number | null, endLedger: number | null, reason: string }>,
    "oldestLedger": number | null,
    "newestLedger": number | null,
    "coverageNotice": "string",
    "readOnly": true,
    "writesState": false
  }
}
```

## Status Codes

- `200`: History reconstructed
- `400`: Invalid request
- `404`: Asset not found
- `413`: Payload too large
- `429`: Rate limit exceeded
- `503`: Service unavailable
