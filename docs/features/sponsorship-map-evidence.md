# Sponsorship Map Evidence

## Data Sources

### Account Information

- **Source**: Horizon API or Stellar RPC
- **Endpoint**: `/accounts/{account_id}` or equivalent RPC method
- **Fields**: `num_sponsoring`, `num_sponsored`, `balances`, `num_entries`
- **Coverage**: Current state only, no historical data

### Sponsored Entries

- **Source**: Account ledger entries
- **Types Covered**:
  - Trustlines (`trust_line_entry`)
  - Offers (`offer_entry`)
  - Data entries (`data_entry`)
  - Signers (`account_entry.signers`)
  - Claimable balances (`claimable_balance_entry`)
- **Limit**: Up to 1,000 entries per account

### Reserve Calculation

- **Base Reserve**: Protocol constant (currently 0.5 XLM)
- **Source**: Network configuration or protocol version
- **Updates**: May change with protocol upgrades

## Coverage

- **Complete**: All entries read successfully
- **Partial**: Some entries could not be read (network issues, rate limits)
- **Unavailable**: Provider temporarily unavailable

## Rate Limits

- **Request Rate**: 20 requests per minute per namespace
- **Payload Size**: Maximum 4096 bytes request size
- **Timeout**: 30 seconds per request

## Accuracy

- Reserve totals match ledger counts in fixtures
- Revocation outcomes match protocol rules for each entry type
- Balance checks use current state only
