import { useState, useCallback } from 'react';
import type { Policy, PayoutPreview } from '@horizoncover/types';
import { calculatePayoutOffchain } from '@horizoncover/sdk';

export function useCoverage(_protocolAddress: string) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [preview, setPreview] = useState<PayoutPreview | null>(null);
  const [loading, setLoading] = useState(true);

  const previewPayout = useCallback((amountDrained: bigint) => {
    if (!policy) return;
    const result = calculatePayoutOffchain(
      amountDrained,
      policy.totalLockedValue,
      policy.drainThresholdBps,
      policy.maxBenefit
    );
    setPreview(result);
  }, [policy]);

  const refreshPolicy = async () => {
    setLoading(true);
    // Mocking SDK call for Phase 6 scaffold
    setTimeout(() => {
      setPolicy({
        beneficiary: 'GBENEFICIARY...',
        maxBenefit: 100000000000n, // 10,000 USDC
        totalLockedValue: 500000000000n, // 50,000 USDC
        drainThresholdBps: 3000, // 30%
        premiumPerPeriod: 5000000000n, // 500 USDC
        lastPremiumPaid: Math.floor(Date.now() / 1000),
        isActive: true,
        isSettled: false
      });
      setLoading(false);
    }, 1000);
  };

  return { policy, preview, loading, previewPayout, refreshPolicy };
}
