import { PayoutPreview } from '@horizoncover/types';

export function calculatePayoutOffchain(
  amountDrained: bigint,
  totalLockedValue: bigint,
  drainThresholdBps: number,
  maxBenefit: bigint
): PayoutPreview {
  const drainRatioBps = (amountDrained * 10_000n) / totalLockedValue;
  const willTrigger = drainRatioBps > BigInt(drainThresholdBps);

  if (!willTrigger) {
    return { 
      drainRatioBps: Number(drainRatioBps), 
      payoutAmount: 0n, 
      payoutPercentage: 0, 
      willTrigger: false 
    };
  }

  const excessBps = drainRatioBps - BigInt(drainThresholdBps);
  const rangeBps = 10_000n - BigInt(drainThresholdBps);
  let payout = (maxBenefit * excessBps) / rangeBps;
  if (payout > maxBenefit) payout = maxBenefit;

  return {
    drainRatioBps: Number(drainRatioBps),
    payoutAmount: payout,
    payoutPercentage: Number((payout * 100n) / maxBenefit),
    willTrigger: true,
  };
}
