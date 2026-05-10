#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Policy {
    pub beneficiary: Address,        // who receives the payout
    pub max_benefit: u128,           // max USDC payout (in stroops)
    pub total_locked_value: u128,    // declared TVL at registration time
    pub drain_threshold: u32,        // e.g. 3000 = 30.00% (basis points)
    pub premium_per_period: u128,    // USDC required per period
    pub last_premium_paid: u64,      // ledger timestamp of last payment
    pub is_active: bool,
    pub is_settled: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Policy(Address),        // policy per covered protocol
    VaultBalance,           // total USDC held
    Admin,                  // protocol admin address
    UsdcToken,              // USDC contract address
    MonitorAdapter,         // monitor adapter address
}

#[contract]
pub struct HorizonCoverVault;

#[contractimpl]
impl HorizonCoverVault {
    // Functions will be implemented here
}
