import { useEffect, useState } from 'react';
import { getHorizonClient } from '../lib/horizon';

type Status = 'unconfigured' | 'loading' | 'ready' | 'error';

export function useVault() {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [status, setStatus] = useState<Status>(() =>
    getHorizonClient() ? 'loading' : 'unconfigured',
  );

  useEffect(() => {
    const client = getHorizonClient();
    if (!client) return;
    let active = true;
    client
      .getVaultBalance()
      .then((b) => {
        if (!active) return;
        setBalance(b);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  return { balance, status };
}
