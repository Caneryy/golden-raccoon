# Clawback History

## Overview

Reconstruct read-only history of clawback operations, authorization changes, and flag modifications for an issued asset.

## Method

Fetches operations from Horizon for the issuer account, filters for clawback, set_trust_line_flags, allow_trust, and set_options operations, groups by holder, calculates totals with asset precision, marks retention gaps.

## Safety

Read-only. No authenticated requests. No state changes.
