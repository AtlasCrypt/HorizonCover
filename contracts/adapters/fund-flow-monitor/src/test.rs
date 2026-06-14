#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{Address, Env};

fn setup() -> (Env, FundFlowMonitorClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let core_vault = Address::generate(&env);
    let id = env.register(FundFlowMonitor, ());
    let monitor = FundFlowMonitorClient::new(&env, &id);
    monitor.initialize(&admin, &core_vault);
    (env, monitor, admin)
}

#[test]
fn whitelist_round_trips() {
    let (env, monitor, _admin) = setup();
    let protocol = Address::generate(&env);

    assert!(!monitor.is_whitelisted_withdrawal(&protocol, &1_000u128, &7u64));
    monitor.register_normal_withdrawal(&protocol, &1_000u128, &7u64);
    assert!(monitor.is_whitelisted_withdrawal(&protocol, &1_000u128, &7u64));
    // Wrong amount for that nonce is not whitelisted.
    assert!(!monitor.is_whitelisted_withdrawal(&protocol, &999u128, &7u64));
}

#[test]
#[should_panic(expected = "whitelisted withdrawal: not an exploit")]
fn whitelisted_withdrawal_cannot_trigger_payout() {
    let (env, monitor, admin) = setup();
    let protocol = Address::generate(&env);

    monitor.register_normal_withdrawal(&protocol, &50_000u128, &1u64);
    // Reporting that same registered withdrawal as a drain must be rejected
    // before any payout is triggered.
    monitor.report_drain_event(&admin, &protocol, &50_000u128, &1u64);
}
