# Security & Threat Model

HorizonCover is designed to secure high-value DeFi protocols. As a parametric insurance protocol, it must balance the need for instant, automated payouts with robust protection against fraudulent claims.

## Role-Based Access Control (RBAC)

The protocol enforces strict access controls using Soroban's `require_auth()` mechanism.

| Role | Capabilities |
|------|--------------|
| **Admin** | Registers new policies and initializes contracts. |
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

### 4. Vault Insolvency (Over-Subscription)
**Attack:** The vault accumulates policies whose combined `max_benefit` exceeds the actual USDC reserves. A single large payout event drains the vault and subsequent policyholders receive nothing.

**Current State:** No solvency ratio is enforced in the MVP.

**Mitigation (Backlog):** Implement a `max_underwriting_ratio` — total active `max_benefit` across all policies cannot exceed X% of vault balance. Suggested starting ratio: 150% (industry standard for parametric pools).

## Known Limitations (MVP Phase)

*This repository is currently in a pre-approval scaffold state for the Stellar Drips Wave Program.*

1. **Oracle Decentralization:** Currently, the Fund Flow monitor relies on an Admin trigger to simulate the detection. Future iterations require fully decentralized on-chain event listeners.
2. **Reentrancy Protection:** While Soroban has built-in protections against reentrancy, explicit non-reentrant state locks should be added before mainnet deployment.
3. **Emergency Controls:** The vault currently lacks an emergency pause capability for the Admin role to halt operations during a critical vulnerability. This must be implemented prior to mainnet.
