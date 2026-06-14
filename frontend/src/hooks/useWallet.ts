import { useEffect, useState } from 'react';
import {
  connectWallet,
  disconnectWallet,
  getConnectedAddress,
  initWalletKit,
  signTransaction as signWithWallet,
} from '../lib/wallet';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore any address the kit already holds (e.g. after a re-render).
  useEffect(() => {
    initWalletKit();
    getConnectedAddress().then((addr) => {
      if (addr) setPublicKey(addr);
    });
  }, []);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const address = await connectWallet();
      setPublicKey(address);
    } catch (e) {
      // The user closing the modal is a normal outcome, not an error to surface.
      const message =
        e instanceof Error ? e.message : String((e as { message?: unknown })?.message ?? e);
      if (!/closed the modal/i.test(message)) setError(message);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    await disconnectWallet();
    setPublicKey(null);
  };

  const signTransaction = async (xdr: string) => {
    if (!publicKey) throw new Error('Connect a wallet before signing.');
    return signWithWallet(xdr);
  };

  return {
    publicKey,
    connect,
    disconnect,
    signTransaction,
    connecting,
    error,
    isConnected: !!publicKey,
  };
}
