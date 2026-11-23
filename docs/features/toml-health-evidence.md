# Stellar.toml Health Evidence

## Data Sources

### TOML File
- Source: `https://{domain}/.well-known/stellar.toml`
- Method: HTTP GET with 8-second timeout
- Size limit: 100KB
- Records: HTTP status, headers, content-type, CORS headers, size, fetch time

### Ledger Data
- Source: Stellar public ledger via Horizon API
- Endpoint: `https://horizon.stellar.org`
- Method: `loadAccount()` for declared issuers and accounts
- Records: home_domain field for backlink verification

### Endpoint Probes
- Method: HTTP GET with 5-second timeout per endpoint
- Target: Declared SEP endpoints (WEB_AUTH_ENDPOINT, TRANSFER_SERVER, etc.)
- Records: HTTP status, reachability, response time
- Limitation: Does not complete authentication or operational flows

## Limits

### Request Limits
- Max domain length: 253 characters
- Max request payload: 4KB
- Rate limit: 10 requests per 60 seconds per namespace

### Response Limits
- Max TOML size: 100KB
- Max endpoints probed: 20
- Max currencies checked: 50
- Max accounts checked: 20
- Max response payload: 1MB

### Timeouts
- TOML fetch: 8 seconds
- Endpoint probe: 5 seconds per endpoint

## Coverage Gaps

### Not Checked
- SEP-10 authentication flows
- Deposit and withdrawal operations
- KYC processes
- Actual transaction submission
- Historical backlink changes
- Off-chain agreements or compliance

### Partial Coverage
- Endpoint health (only GET requests, no deep functional testing)
- Field validity (syntax only, not semantic correctness)
- Backlinks (current state only, not historical)

## Interpretation

A passing audit means:
- The stellar.toml file is fetchable and parsable
- Declared endpoints respond to GET requests
- Declared issuers and accounts point back to the domain

A passing audit **does not** prove:
- The anchor is trustworthy or compliant
- Endpoints support complete SEP flows
- Assets are backed by real-world reserves
- The organization is licensed or regulated
