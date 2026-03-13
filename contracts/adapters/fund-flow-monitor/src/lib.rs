#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

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
}
