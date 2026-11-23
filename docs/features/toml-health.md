# Stellar.toml Health Audit

## Overview

The stellar.toml health audit feature provides a read-only examination of a domain's stellar.toml file, including:
- Fetch status and HTTP headers
- TOML parsing and field validation
- SEP endpoint reachability
- Currency and account backlink verification

## Method

### 1. Domain Validation
- Validates domain format (RFC 1035)
- Enforces length limits (max 253 characters)
- Rejects invalid characters and patterns

### 2. TOML Fetch
- Fetches `https://{domain}/.well-known/stellar.toml`
- Records HTTP status, content-type, CORS headers, size, and fetch time
- Enforces timeout (8 seconds) and size limits (100KB)

### 3. TOML Parsing
- Parses with strict TOML parser
- Reports unknown, duplicated, and malformed fields
- Never guesses or infers missing values

### 4. Field Validation
- Validates SIGNING_KEY and URI_REQUEST_SIGNING_KEY as valid Stellar public keys
- Validates URL fields (FEDERATION_SERVER, WEB_AUTH_ENDPOINT, etc.)
- Reports malformed values without attempting correction

### 5. Endpoint Probes
- Sends read-only GET requests to declared SEP endpoints
- Records reachability, HTTP status, and response time
- Never sends authenticated requests or state-changing operations
- Enforces probe timeout (5 seconds per endpoint)

### 6. Backlink Checks
- Queries public ledger for declared currency issuers
- Queries public ledger for declared accounts
- Compares ledger home_domain with the audited domain
- Reports matches and mismatches

### 7. Header Checks
- Verifies content-type (expects text/plain or application/toml)
- Verifies CORS headers (access-control-allow-origin)
- Reports findings for each header

## Limitations

- Does not complete SEP-10 authentication flows
- Does not test deposit or withdrawal operations
- Backlink checks query only the current ledger state
- Endpoint probes are shallow (GET requests only)
- A passing result does not prove the anchor is trustworthy or compliant

## Safety

- All operations are read-only
- No authenticated requests
- No state-changing operations
- No data written to the ledger
- No transaction signing
