/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOROBAN_RPC_URL?: string;
  readonly VITE_CORE_CONTRACT_ID?: string;
  readonly VITE_MONITOR_CONTRACT_ID?: string;
  readonly VITE_USDC_CONTRACT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
