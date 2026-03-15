#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    UsdcToken,
    Balance,
}

#[contract]
pub struct MockProtocol;

#[contractimpl]
impl MockProtocol {
    pub fn initialize(env: Env, usdc_token: Address) {
        if env.storage().instance().has(&DataKey::UsdcToken) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        env.storage().instance().set(&DataKey::Balance, &0u128);
    }

    pub fn deposit(env: Env, user: Address, amount: u128) {
        user.require_auth();
        
        let usdc_token: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &usdc_token);
        let contract_address = env.current_contract_address();
        
        token_client.transfer(&user, &contract_address, &(amount as i128));

        let mut balance: u128 = env.storage().instance().get(&DataKey::Balance).unwrap_or(0);
        balance += amount;
        env.storage().instance().set(&DataKey::Balance, &balance);
    }

    pub fn withdraw(env: Env, to: Address, amount: u128) {
        to.require_auth();
        
        let mut balance: u128 = env.storage().instance().get(&DataKey::Balance).unwrap_or(0);
        if amount > balance {
            panic!("insufficient balance");
        }
        balance -= amount;
        env.storage().instance().set(&DataKey::Balance, &balance);

        let usdc_token: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &usdc_token);
        let contract_address = env.current_contract_address();
        
        token_client.transfer(&contract_address, &to, &(amount as i128));
    }

    pub fn drain(env: Env, hacker: Address, amount: u128) {
        // Simulates an exploit, transfers funds without proper checks
        hacker.require_auth();

        let mut balance: u128 = env.storage().instance().get(&DataKey::Balance).unwrap_or(0);
        if amount > balance {
            panic!("insufficient balance to drain");
        }
        balance -= amount;
        env.storage().instance().set(&DataKey::Balance, &balance);

        let usdc_token: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        let token_client = soroban_sdk::token::Client::new(&env, &usdc_token);
        let contract_address = env.current_contract_address();
        
        token_client.transfer(&contract_address, &hacker, &(amount as i128));
    }

    pub fn get_balance(env: Env) -> u128 {
        env.storage().instance().get(&DataKey::Balance).unwrap_or(0)
    }
}
