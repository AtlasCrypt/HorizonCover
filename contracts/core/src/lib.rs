#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Policy {
    pub beneficiary: Address,     // who receives the payout
    pub max_benefit: u128,        // max USDC payout (in stroops)
    pub total_locked_value: u128, // declared TVL at registration time
    pub drain_threshold: u32,     // e.g. 3000 = 30.00% (basis points)
    pub premium_per_period: u128, // USDC required per period
    pub last_premium_paid: u64,   // ledger timestamp of last payment
    pub is_active: bool,
    pub is_settled: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Policy(Address), // policy per covered protocol
    VaultBalance,    // total USDC held
    Admin,           // protocol admin address
    UsdcToken,       // USDC contract address
    MonitorAdapter,  // monitor adapter address
}

#[contract]
pub struct HorizonCoverVault;

#[contractimpl]
impl HorizonCoverVault {
    pub fn initialize(env: Env, admin: Address, usdc_token: Address, monitor_adapter: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::UsdcToken, &usdc_token);
        env.storage()
            .instance()
            .set(&DataKey::MonitorAdapter, &monitor_adapter);
        env.storage().instance().set(&DataKey::VaultBalance, &0u128);
    }

    pub fn register_policy(
        env: Env,
        protocol: Address,
        beneficiary: Address,
        max_benefit: u128,
        tvl: u128,
        threshold_bps: u32,
        premium: u128,
    ) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let policy_key = DataKey::Policy(protocol.clone());
        if env.storage().persistent().has(&policy_key) {
            panic!("policy already exists");
        }

        let policy = Policy {
            beneficiary,
            max_benefit,
            total_locked_value: tvl,
            drain_threshold: threshold_bps,
            premium_per_period: premium,
            last_premium_paid: 0,
            is_active: true,
            is_settled: false,
        };

        env.storage().persistent().set(&policy_key, &policy);
    }

    /// Deposits USDC into the vault to underwrite future payouts. Premiums alone
    /// cannot cover max benefits, so underwriters supply the backing capital.
    pub fn deposit_liquidity(env: Env, from: Address, amount: u128) {
        from.require_auth();

        let usdc_token: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &usdc_token);
        let vault_address = env.current_contract_address();
        token_client.transfer(&from, &vault_address, &(amount as i128));

        let mut vault_balance: u128 = env
            .storage()
            .instance()
            .get(&DataKey::VaultBalance)
            .unwrap();
        vault_balance = vault_balance
            .checked_add(amount)
            .expect("vault balance overflow");
        env.storage()
            .instance()
            .set(&DataKey::VaultBalance, &vault_balance);
    }

    pub fn pay_premium(env: Env, protocol: Address) {
        let policy_key = DataKey::Policy(protocol.clone());
        let mut policy: Policy = env.storage().persistent().get(&policy_key).unwrap();

        if !policy.is_active || policy.is_settled {
            panic!("policy not active or already settled");
        }

        protocol.require_auth();

        let usdc_token: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &usdc_token);

        let vault_address = env.current_contract_address();
        token_client.transfer(
            &protocol,
            &vault_address,
            &(policy.premium_per_period as i128),
        );

        policy.last_premium_paid = env.ledger().timestamp();
        env.storage().persistent().set(&policy_key, &policy);

        let mut vault_balance: u128 = env
            .storage()
            .instance()
            .get(&DataKey::VaultBalance)
            .unwrap();
        vault_balance += policy.premium_per_period;
        env.storage()
            .instance()
            .set(&DataKey::VaultBalance, &vault_balance);
    }

    pub fn is_premium_current(env: Env, protocol: Address) -> bool {
        let policy_key = DataKey::Policy(protocol);
        let policy: Policy = env.storage().persistent().get(&policy_key).unwrap();

        // 30 days in seconds = 30 * 24 * 60 * 60 = 2592000
        let grace_period: u64 = 2_592_000;

        if policy.last_premium_paid == 0 {
            return false;
        }

        let current_time = env.ledger().timestamp();
        current_time <= policy.last_premium_paid + grace_period
    }

    pub fn trigger_payout(env: Env, protocol: Address, amount_drained: u128) {
        let monitor: Address = env
            .storage()
            .instance()
            .get(&DataKey::MonitorAdapter)
            .unwrap();
        monitor.require_auth();

        let policy_key = DataKey::Policy(protocol.clone());
        let mut policy: Policy = env.storage().persistent().get(&policy_key).unwrap();

        if !policy.is_active || policy.is_settled {
            panic!("policy not active or already settled");
        }

        if !Self::is_premium_current(env.clone(), protocol.clone()) {
            panic!("premium not current");
        }

        // Cap the payout to the capital actually held so the vault can never
        // promise more than it can pay (and the subtraction can never underflow).
        let vault_balance: u128 = env
            .storage()
            .instance()
            .get(&DataKey::VaultBalance)
            .unwrap();
        let payout = calculate_payout(&policy, amount_drained).min(vault_balance);

        if payout > 0 {
            let usdc_token: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
            let token_client = soroban_sdk::token::Client::new(&env, &usdc_token);
            let vault_address = env.current_contract_address();

            token_client.transfer(&vault_address, &policy.beneficiary, &(payout as i128));

            env.storage()
                .instance()
                .set(&DataKey::VaultBalance, &(vault_balance - payout));
        }

        policy.is_settled = true;
        env.storage().persistent().set(&policy_key, &policy);
    }

    pub fn get_policy(env: Env, protocol: Address) -> Policy {
        env.storage()
            .persistent()
            .get(&DataKey::Policy(protocol))
            .unwrap()
    }

    pub fn get_vault_balance(env: Env) -> u128 {
        env.storage()
            .instance()
            .get(&DataKey::VaultBalance)
            .unwrap()
    }
}

#[cfg(test)]
mod test;

fn calculate_payout(policy: &Policy, amount_drained: u128) -> u128 {
    let drain_bps = (amount_drained * 10_000) / policy.total_locked_value;

    if drain_bps <= policy.drain_threshold as u128 {
        return 0;
    }

    let excess_bps = drain_bps - policy.drain_threshold as u128;
    let range_bps = 10_000u128 - policy.drain_threshold as u128;
    let payout = policy.max_benefit * excess_bps / range_bps;

    payout.min(policy.max_benefit)
}
