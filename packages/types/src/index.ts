export interface Policy {
  beneficiary: string;           // Stellar address
  maxBenefit: bigint;            // USDC in stroops
  totalLockedValue: bigint;
  drainThresholdBps: number;     // basis points e.g. 3000 = 30%
  premiumPerPeriod: bigint;
  lastPremiumPaid: number;       // ledger timestamp
  isActive: boolean;
  isSettled: boolean;
}

export interface CoverageParams {
  protocolAddress: string;
  beneficiary: string;
  maxBenefit: bigint;
  tvl: bigint;
  thresholdBps: number;
  premiumPerPeriod: bigint;
}

export interface PayoutPreview {
  drainRatioBps: number;
  payoutAmount: bigint;
  payoutPercentage: number;
  willTrigger: boolean;
}

export interface VaultStats {
  totalPremiumsCollected: bigint;
  totalPayoutsExecuted: bigint;
  activePolicies: number;
  vaultBalance: bigint;
}
