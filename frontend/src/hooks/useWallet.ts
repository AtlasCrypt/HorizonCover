import { useState } from 'react';

// Wallet integration will use @creit.tech/stellar-wallets-kit in Phase 7
// For now, this is a mock hook for UI development

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connect = async () => {
    // Mock: simulate wallet connection for UI dev
    setPublicKey('GBENEFICIARY1234567890ABCDEFGHIJKLMNOPQRSTUVWX');
  };

  const disconnect = () => {
    setPublicKey(null);
  };

  const signTransaction = async (_xdr: string) => {
    throw new Error("Wallet not connected — connect in Phase 7");
  };

  return { publicKey, connect, disconnect, signTransaction, isConnected: !!publicKey };
}
