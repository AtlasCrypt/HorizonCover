import { HorizonClient } from '@horizoncover/sdk';
import { CONTRACTS, RPC_URL, isConfigured } from '../config';

let client: HorizonClient | null = null;

// Returns a shared client, or null when contract IDs aren't configured yet.
export function getHorizonClient(): HorizonClient | null {
  if (!isConfigured()) return null;
  if (!client) {
    client = new HorizonClient(RPC_URL, CONTRACTS.core, CONTRACTS.monitor);
  }
  return client;
}
