import { Networks } from '@creit.tech/stellar-wallets-kit';

// Runtime configuration sourced from Vite env vars (see .env.example).
// Contract IDs are optional: when absent the UI runs in "unconfigured"
// mode and shows setup hints instead of fabricated data.

const env = import.meta.env;

export const NETWORK_PASSPHRASE = Networks.TESTNET;

export const RPC_URL: string =
  env.VITE_SOROBAN_RPC_URL ?? 'https://soroban-testnet.stellar.org';

export const CONTRACTS = {
  core: env.VITE_CORE_CONTRACT_ID ?? '',
  monitor: env.VITE_MONITOR_CONTRACT_ID ?? '',
  usdc: env.VITE_USDC_CONTRACT_ID ?? '',
} as const;

export const isConfigured = (): boolean =>
  Boolean(CONTRACTS.core && CONTRACTS.monitor);
