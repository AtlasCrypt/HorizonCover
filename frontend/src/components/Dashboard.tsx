import { WalletButton } from './WalletButton';
import { ProtocolCard } from './ProtocolCard';
import { PayoutSimulator } from './PayoutSimulator';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="flex justify-between items-center max-w-5xl mx-auto mb-12">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          HorizonCover
        </h1>
        <WalletButton />
      </header>
      
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ProtocolCard protocolAddress="GBENEFICIARY..." />
          <PayoutSimulator />
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Vault Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-950 rounded-lg">
              <div className="text-gray-400 text-sm">Total Value Locked</div>
              <div className="text-2xl font-bold text-emerald-400">$1,000,000</div>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg">
              <div className="text-gray-400 text-sm">Active Policies</div>
              <div className="text-2xl font-bold">12</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
