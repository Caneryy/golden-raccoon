# Sponsorship Map

## Overview

This feature maps every ledger entry an account sponsors or is sponsored for, and what would happen to each if the sponsorship were revoked.

## Method

### Input

- **Account**: Stellar account address
- **Network**: stellar-testnet or stellar-pubnet

### Process

1. **Read Account Details**: Query `num_sponsoring` and `num_sponsored` from account
2. **Read Sponsored Entries**: Fetch trustlines, offers, data entries, signers, and claimable balances with sponsorship information
3. **Build Graph**: Create sponsor-to-sponsored relationships with entry types and reserve amounts
4. **Analyze Revocation**: For each sponsored entry, determine what would happen if `revoke_sponsorship` were called
5. **Flag Exposure**: Identify accounts that would drop below minimum balance

### Reserve Rules

- **Base Reserve**: 0.5 XLM (5,000,000 stroops) per entry
- **Minimum Account Balance**: 1 XLM (10,000,000 stroops) = 2 × base reserve
- **Required Reserve**: minimum balance + (base reserve × number of entries)

### Revocation Outcomes

- **Safe**: Account has sufficient balance to cover reserve if sponsorship is revoked
- **Underfunded**: Account would fall below minimum balance
- **Critical**: Account has zero balance and would fail immediately

## Limitations

- Does not build or submit sponsorship transactions
- Does not predict future balance changes
- Does not analyze sponsor's ability to continue sponsoring
- Base reserve source is protocol constant (may change with network upgrades)
