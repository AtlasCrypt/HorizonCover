import { useCallback, useEffect, useState } from 'react';
import type { Policy, PayoutPreview } from '@horizoncover/types';
import { calculatePayoutOffchain } from '@horizoncover/sdk';
import { getHorizonClient } from '../lib/horizon';

type Status = 'unconfigured' | 'loading' | 'ready' | 'error';

export function useCoverage(protocolAddress: string) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [preview, setPreview] = useState<PayoutPreview | null>(null);
  const [status, setStatus] = useState<Status>(() =>
    getHorizonClient() && protocolAddress ? 'loading' : 'unconfigured',
  );
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refreshPolicy = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const client = getHorizonClient();
      if (!client || !protocolAddress) {
        if (active) setStatus('unconfigured');
        return;
      }
      if (active) {
        setStatus('loading');
        setError(null);
      }
      try {
        const result = await client.getPolicy(protocolAddress);
        if (!active) return;
        setPolicy(result);
        setStatus('ready');
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : String(e));
        setStatus('error');
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [protocolAddress, reloadKey]);

  const previewPayout = useCallback(
    (amountDrained: bigint) => {
      if (!policy) return;
      setPreview(
        calculatePayoutOffchain(
          amountDrained,
          policy.totalLockedValue,
          policy.drainThresholdBps,
          policy.maxBenefit,
        ),
      );
    },
    [policy],
  );

  return { policy, preview, status, error, previewPayout, refreshPolicy };
}
