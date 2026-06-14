import {
  Account,
  BASE_FEE,
  Contract,
  Keypair,
  TransactionBuilder,
  rpc,
  scValToNative,
  xdr,
} from '@stellar/stellar-sdk';
import type { Policy } from '@horizoncover/types';
import { addressToScVal } from './xdr-helpers';

// A throwaway source account is fine for read-only simulation: the
// transaction is never signed or submitted, only simulated.
const SIMULATION_SOURCE = Keypair.random().publicKey();

export class HorizonClient {
  public rpcUrl: string;
  public coreContractId: string;
  public monitorContractId: string;
  private server: rpc.Server;

  constructor(rpcUrl: string, coreContractId: string, monitorContractId: string) {
    this.rpcUrl = rpcUrl;
    this.coreContractId = coreContractId;
    this.monitorContractId = monitorContractId;
    this.server = new rpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http://') });
  }

  // Simulates a read-only contract call and returns the decoded native value.
  private async readContract(
    contractId: string,
    method: string,
    args: xdr.ScVal[] = [],
  ): Promise<any> {
    const networkPassphrase = (await this.server.getNetwork()).passphrase;
    const contract = new Contract(contractId);
    const source = new Account(SIMULATION_SOURCE, '0');
    const tx = new TransactionBuilder(source, { fee: BASE_FEE, networkPassphrase })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const sim = await this.server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(sim)) {
      throw new Error(`Simulation failed for ${method}: ${sim.error}`);
    }
    const retval = sim.result?.retval;
    return retval ? scValToNative(retval) : undefined;
  }

  async getPolicy(protocolAddress: string): Promise<Policy> {
    const raw = await this.readContract(this.coreContractId, 'get_policy', [
      addressToScVal(protocolAddress),
    ]);
    return {
      beneficiary: raw.beneficiary,
      maxBenefit: BigInt(raw.max_benefit),
      totalLockedValue: BigInt(raw.total_locked_value),
      drainThresholdBps: Number(raw.drain_threshold),
      premiumPerPeriod: BigInt(raw.premium_per_period),
      lastPremiumPaid: Number(raw.last_premium_paid),
      isActive: raw.is_active,
      isSettled: raw.is_settled,
    };
  }

  async getVaultBalance(): Promise<bigint> {
    const raw = await this.readContract(this.coreContractId, 'get_vault_balance');
    return BigInt(raw ?? 0);
  }
}
