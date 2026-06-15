import { useWallet } from '../hooks/useWallet';
import { Wallet, LogOut } from 'lucide-react';

export function WalletButton() {
  const { publicKey, connect, disconnect, isConnected, connecting } = useWallet();

  if (isConnected) {
    return (
      <button
        onClick={disconnect}
        className="group inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-sm font-medium text-emerald-300 transition-colors hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 group-hover:hidden" />
        <LogOut size={15} className="hidden group-hover:block" />
        <span className="font-mono">
          {publicKey?.slice(0, 4)}…{publicKey?.slice(-4)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-400 to-sky-500 px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Wallet size={16} />
      {connecting ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
}
