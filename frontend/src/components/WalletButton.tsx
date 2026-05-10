import { useWallet } from '../hooks/useWallet';
import { Wallet } from 'lucide-react';

export function WalletButton() {
  const { publicKey, connect, disconnect, isConnected } = useWallet();

  return (
    <button 
      onClick={isConnected ? disconnect : connect}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors"
    >
      <Wallet size={18} />
      {isConnected ? `${publicKey?.slice(0, 5)}...${publicKey?.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}
