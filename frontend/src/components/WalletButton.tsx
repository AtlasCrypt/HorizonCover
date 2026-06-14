import { useWallet } from '../hooks/useWallet';
import { Wallet } from 'lucide-react';

export function WalletButton() {
  const { publicKey, connect, disconnect, isConnected, connecting } = useWallet();

  return (
    <button
      onClick={isConnected ? disconnect : connect}
      disabled={connecting}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet size={18} />
      {connecting
        ? 'Connecting…'
        : isConnected
          ? `${publicKey?.slice(0, 5)}...${publicKey?.slice(-4)}`
          : 'Connect Wallet'}
    </button>
  );
}
