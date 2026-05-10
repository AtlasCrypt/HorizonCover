import type { Policy, CoverageParams } from '@horizoncover/types';

export class HorizonClient {
  public rpcUrl: string;
  public coreContractId: string;
  public monitorContractId: string;

  constructor(rpcUrl: string, coreContractId: string, monitorContractId: string) {
    this.rpcUrl = rpcUrl;
    this.coreContractId = coreContractId;
    this.monitorContractId = monitorContractId;
  }

  async getPolicy(_protocolAddress: string): Promise<Policy> {
    throw new Error('Not implemented');
  }

  async getVaultBalance(): Promise<bigint> {
    throw new Error('Not implemented');
  }

  async simulatePremiumPayment(_protocolAddress: string): Promise<any> {
    throw new Error('Not implemented');
  }

  async simulateRegisterPolicy(_params: CoverageParams): Promise<any> {
    throw new Error('Not implemented');
  }
}
