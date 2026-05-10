import { useState } from 'react';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);

  const connect = async () => {
    try {
      const newKit = new StellarWalletsKit({
        network: 'TESTNET' as any,
        selectedWalletId: 'freighter'
      });
      setKit(newKit);
      await newKit.openModal({
        onWalletSelected: async (option) => {
          newKit.setWallet(option.id);
          const pk = await newKit.getPublicKey();
          setPublicKey(pk);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
  };

  const signTransaction = async (xdr: string) => {
    if (!kit || !publicKey) throw new Error("Wallet not connected");
    const { signedXDR } = await kit.sign({
      xdr,
      publicKey
    });
    return signedXDR;
  };

  return { publicKey, connect, disconnect, signTransaction, isConnected: !!publicKey };
}
