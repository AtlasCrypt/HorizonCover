import { WalletButton } from './WalletButton';
import { ProtocolCard } from './ProtocolCard';
import { PayoutSimulator } from './PayoutSimulator';
import { useVault } from '../hooks/useVault';
import { DEMO_PROTOCOL_ID } from '../config';

function formatUsdc(stroops: bigint): string {
  return `$${(Number(stroops) / 1e7).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function Dashboard() {
  const { balance, status } = useVault();

  const vaultDisplay =
    status === 'ready' && balance !== null
      ? formatUsdc(balance)
      : status === 'unconfigured'
        ? '—'
        : status === 'error'
          ? 'Error'
          : '…';

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="flex justify-between items-center max-w-5xl mx-auto mb-12">
        <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          HorizonCover
        </h1>
        <WalletButton />
      </header>

      {status === 'unconfigured' && (
        <div className="max-w-5xl mx-auto mb-8 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          Running in preview mode — no contracts configured. The simulator below uses the live
          on-chain payout formula; connect a deployment via <code>.env.local</code> to show real
          vault data.
        </div>
      )}

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ProtocolCard protocolAddress={DEMO_PROTOCOL_ID} />
          <PayoutSimulator />
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Vault Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-950 rounded-lg">
              <div className="text-gray-400 text-sm">Vault Balance</div>
              <div className="text-2xl font-bold text-emerald-400">{vaultDisplay}</div>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg">
              <div className="text-gray-400 text-sm">Network</div>
              <div className="text-2xl font-bold">Testnet</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
