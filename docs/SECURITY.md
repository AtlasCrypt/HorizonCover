# Security & Threat Model

HorizonCover is designed to secure high-value DeFi protocols. As a parametric insurance protocol, it must balance the need for instant, automated payouts with robust protection against fraudulent claims.

## Role-Based Access Control (RBAC)

The protocol enforces strict access controls using Soroban's `require_auth()` mechanism.

| Role | Capabilities |
|------|--------------|
| **Admin** | Registers new policies, initializes contracts, and has emergency pause capabilities (to be implemented). |
| **Monitor Adapter** | The *only* address authorized to call `trigger_payout` on the Core Vault. |
| **Protocol (Client)** | Can call `pay_premium` and `register_normal_withdrawal` (whitelist). |
| **Beneficiary** | The address that receives the USDC payout. Cannot trigger the payout themselves. |

## Threat Model

### 1. The "Inside Job" (False Positive Drain)
**Attack:** A covered protocol's admin intentionally drains their own protocol to trigger an insurance payout, effectively double-dipping (keeping the stolen funds + receiving the insurance USDC).
**Mitigation:** 
- The `Beneficiary` address must be a trusted multi-sig or a DAO treasury, not an individual developer.
- Future versions will implement a time-lock on payouts or require proof of a known exploit signature rather than purely relying on a balance drop.

### 2. Monitor Adapter Compromise
**Attack:** An attacker gains control of the `Fund Flow Monitor` contract and sends fraudulent `report_drain_event` calls to the Core Vault, draining the insurance liquidity pool.
**Mitigation:**
- The Core Vault strictly verifies that the caller is the exact `MonitorAdapter` address registered at initialization. 
- The Monitor Adapter itself does not hold funds.
- (Backlog): Implement a multi-oracle consensus model before moving out of MVP.

### 3. Premium Evasion
**Attack:** A protocol attempts to claim a payout while their policy is lapsed.
**Mitigation:**
- The `is_premium_current` helper verifies the `last_premium_paid` ledger timestamp against a strict 30-day grace period. Payouts `panic!` if the premium is lapsed.

## Known Limitations (MVP Phase)

*This repository is currently in a pre-approval scaffold state for the Stellar Drips Wave Program.*

1. **Oracle Decentralization:** Currently, the Fund Flow monitor relies on an Admin trigger to simulate the detection. Future iterations require fully decentralized on-chain event listeners.
2. **Reentrancy Protection:** While Soroban has built-in protections against reentrancy, explicit non-reentrant state locks should be added before mainnet deployment.
3. **Liquidity Solvency:** The vault does not currently restrict the total `max_benefit` of all active policies against its actual USDC reserves. A solvency ratio check must be implemented.
