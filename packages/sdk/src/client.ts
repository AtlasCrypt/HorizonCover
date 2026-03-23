import { rpc } from '@stellar/stellar-sdk';
import { Policy, CoverageParams } from '@horizoncover/types';

export class HorizonClient {
  public rpc: rpc.Server;
  public coreContractId: string;
  public monitorContractId: string;

  constructor(rpcUrl: string, coreContractId: string, monitorContractId: string) {
    this.rpc = new rpc.Server(rpcUrl, { allowHttp: true });
    this.coreContractId = coreContractId;
    this.monitorContractId = monitorContractId;
  }

  async getPolicy(protocolAddress: string): Promise<Policy> {
    throw new Error('Not implemented');
  }

  async getVaultBalance(): Promise<bigint> {
    throw new Error('Not implemented');
  }

  async simulatePremiumPayment(protocolAddress: string): Promise<any> {
    throw new Error('Not implemented');
  }

  async simulateRegisterPolicy(params: CoverageParams): Promise<any> {
    throw new Error('Not implemented');
  }
}
