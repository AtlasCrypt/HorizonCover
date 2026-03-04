# HorizonCover

The first parametric DeFi protocol insurance layer on Stellar. HorizonCover lets Soroban-based protocols register for automatic hack protection. If a covered protocol is drained beyond a defined threshold in a single suspicious transaction, payout is instant and trustless — no claims, no adjusters, no delays. Built as a public good for the Stellar DeFi ecosystem.

## The Problem vs. HorizonCover

| Traditional Insurance | HorizonCover |
|-----------------------|--------------|
| Manual claims adjusters | 100% code-driven |
| Weeks/months to payout | Instant (same block) |
| Human error and bias | Parametric trigger |

## How the Parametric Trigger Works

HorizonCover monitors the flow of funds from the covered protocol. A payout is triggered automatically if the "drain ratio" exceeds a pre-defined threshold:

```
drain_ratio = funds_drained / total_locked_value

if drain_ratio > drain_threshold:
    payout = max_benefit × (drain_ratio − drain_threshold) / (1.0 − drain_threshold)
    payout = min(payout, max_benefit)   -- cap at 100%
```

## Architecture

```text
[ Covered Protocol ]
        |
        | register_policy() / pay_premium()
        v
[ HorizonCover Core Vault Contract ]
        |
        | stores Policy on-chain & holds premiums
        v
[ Fund Flow Monitor Adapter Contract ]
        |
        | report_drain_event() calls trigger_payout()
        v
[ Payout Execution ] -> [ Beneficiary Address ]
```

## Quick Start

```bash
git clone https://github.com/AtlasCrypt/HorizonCover.git
cd HorizonCover
pnpm install
cp .env.example .env
pnpm dev
```

## Testnet Contract IDs

- **Core Vault:** `(TBD)`
- **Monitor Adapter:** `(TBD)`
- **Mock Protocol:** `(TBD)`

## Contributing

Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) to get started with local development and claim issues for the Stellar Drips Wave Program.
