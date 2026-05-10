#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, IntoVal};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    CoreVault,
    WhitelistedWithdrawal(Address, u64), // protocol address, nonce
}

#[contract]
pub struct FundFlowMonitor;

#[contractimpl]
impl FundFlowMonitor {
    pub fn initialize(env: Env, admin: Address, core_vault: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::CoreVault, &core_vault);
    }

    pub fn report_drain_event(env: Env, reporter: Address, protocol: Address, amount_drained: u128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        
        reporter.require_auth();
        if reporter != admin {
            panic!("only admin can report drain events in MVP");
        }

        let core_vault: Address = env.storage().instance().get(&DataKey::CoreVault).unwrap();

        env.invoke_contract::<()>(
            &core_vault,
            &soroban_sdk::Symbol::new(&env, "trigger_payout"),
            soroban_sdk::vec![&env, protocol.into_val(&env), amount_drained.into_val(&env)],
        );
    }

    pub fn register_normal_withdrawal(env: Env, protocol: Address, amount: u128, nonce: u64) {
        protocol.require_auth();
        
        let key = DataKey::WhitelistedWithdrawal(protocol, nonce);
        env.storage().persistent().set(&key, &amount);
    }

    pub fn is_whitelisted_withdrawal(env: Env, protocol: Address, amount: u128, nonce: u64) -> bool {
        let key = DataKey::WhitelistedWithdrawal(protocol, nonce);
        if let Some(whitelisted_amount) = env.storage().persistent().get::<_, u128>(&key) {
            whitelisted_amount == amount
        } else {
            false
        }
    }
}
