#![no_std]

use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct MockProtocol;

#[contractimpl]
impl MockProtocol {
    /// Placeholder — mock contract shell. Implementation follows in Phase 3.
    pub fn version(env: Env) -> u32 {
        env.storage().instance().extend_ttl(100, 100);
        1
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_version() {
        let env = Env::default();
        let contract_id = env.register(MockProtocol, ());
        let client = MockProtocolClient::new(&env, &contract_id);
        assert_eq!(client.version(), 1);
    }
}
