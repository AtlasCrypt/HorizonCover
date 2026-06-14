#![cfg(test)]

use super::*;
use soroban_sdk::testutils::{Address as _, Ledger as _};
use soroban_sdk::{token, Address, Env};

struct Setup {
    env: Env,
    vault: HorizonCoverVaultClient<'static>,
    usdc: token::Client<'static>,
    usdc_admin: token::StellarAssetClient<'static>,
    admin: Address,
    monitor: Address,
}

fn setup() -> Setup {
    let env = Env::default();
    env.mock_all_auths();
    // Real ledgers are never at timestamp 0; the contract treats a zero
    // last_premium_paid as "never paid", so use a realistic clock.
    env.ledger().set_timestamp(1_700_000_000);

    let admin = Address::generate(&env);
    let monitor = Address::generate(&env);

    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let usdc = token::Client::new(&env, &sac.address());
    let usdc_admin = token::StellarAssetClient::new(&env, &sac.address());

    let vault_id = env.register(HorizonCoverVault, ());
    let vault = HorizonCoverVaultClient::new(&env, &vault_id);
    vault.initialize(&admin, &sac.address(), &monitor);

    Setup {
        env,
        vault,
        usdc,
        usdc_admin,
        admin,
        monitor,
    }
}

// Registers a standard policy and funds the vault so payouts can settle.
fn register_funded_policy(s: &Setup, protocol: &Address, beneficiary: &Address) {
    s.vault.register_policy(
        protocol,
        beneficiary,
        &100_000u128, // max_benefit
        &500_000u128, // tvl
        &3_000u32,    // 30% threshold
        &5_000u128,   // premium per period
    );

    // Underwriter backs the vault with capital.
    let underwriter = Address::generate(&s.env);
    s.usdc_admin.mint(&underwriter, &200_000i128);
    s.vault.deposit_liquidity(&underwriter, &150_000u128);

    // Protocol pays its premium so coverage is current.
    s.usdc_admin.mint(protocol, &10_000i128);
    s.vault.pay_premium(protocol);
}

#[test]
fn payout_scales_with_drain_severity() {
    let s = setup();
    let protocol = Address::generate(&s.env);
    let beneficiary = Address::generate(&s.env);
    register_funded_policy(&s, &protocol, &beneficiary);

    // 50% drained, threshold 30%: payout = max_benefit * 2000 / 7000.
    let drained = 250_000u128;
    let expected = 100_000u128 * 2_000 / 7_000;
    let balance_before = s.vault.get_vault_balance();

    s.vault.trigger_payout(&protocol, &drained);

    assert_eq!(s.usdc.balance(&beneficiary), expected as i128);
    assert_eq!(s.vault.get_vault_balance(), balance_before - expected);
    assert!(s.vault.get_policy(&protocol).is_settled);
}

#[test]
fn drain_below_threshold_pays_nothing() {
    let s = setup();
    let protocol = Address::generate(&s.env);
    let beneficiary = Address::generate(&s.env);
    register_funded_policy(&s, &protocol, &beneficiary);

    let balance_before = s.vault.get_vault_balance();
    s.vault.trigger_payout(&protocol, &100_000u128); // 20% < 30% threshold

    assert_eq!(s.usdc.balance(&beneficiary), 0);
    assert_eq!(s.vault.get_vault_balance(), balance_before);
}

#[test]
fn payout_is_capped_to_vault_balance() {
    let s = setup();
    let protocol = Address::generate(&s.env);
    let beneficiary = Address::generate(&s.env);

    // Policy with a large benefit but a deliberately under-funded vault.
    s.vault.register_policy(
        &protocol,
        &beneficiary,
        &1_000_000u128,
        &1_000_000u128,
        &1_000u32,
        &5_000u128,
    );
    let underwriter = Address::generate(&s.env);
    s.usdc_admin.mint(&underwriter, &50_000i128);
    s.vault.deposit_liquidity(&underwriter, &40_000u128);
    s.usdc_admin.mint(&protocol, &10_000i128);
    s.vault.pay_premium(&protocol);

    let vault_balance = s.vault.get_vault_balance();
    s.vault.trigger_payout(&protocol, &1_000_000u128); // 100% drain, huge payout

    // Payout cannot exceed what the vault holds, and balance never underflows.
    assert_eq!(s.usdc.balance(&beneficiary), vault_balance as i128);
    assert_eq!(s.vault.get_vault_balance(), 0);
}

#[test]
#[should_panic(expected = "premium not current")]
fn payout_requires_current_premium() {
    let s = setup();
    let protocol = Address::generate(&s.env);
    let beneficiary = Address::generate(&s.env);

    // Register and fund, but never pay a premium.
    s.vault.register_policy(
        &protocol,
        &beneficiary,
        &100_000u128,
        &500_000u128,
        &3_000u32,
        &5_000u128,
    );
    let underwriter = Address::generate(&s.env);
    s.usdc_admin.mint(&underwriter, &200_000i128);
    s.vault.deposit_liquidity(&underwriter, &150_000u128);

    s.vault.trigger_payout(&protocol, &250_000u128);
}

#[test]
fn deposit_liquidity_increases_vault_balance() {
    let s = setup();
    let underwriter = Address::generate(&s.env);
    s.usdc_admin.mint(&underwriter, &100_000i128);

    s.vault.deposit_liquidity(&underwriter, &75_000u128);

    assert_eq!(s.vault.get_vault_balance(), 75_000u128);
    assert_eq!(s.usdc.balance(&underwriter), 25_000i128);

    // Silence unused-field warnings for fields used only in other tests.
    let _ = (&s.admin, &s.monitor);
}
