import { useEffect } from 'react';
import { useCoverage } from '../hooks/useCoverage';
import { Shield } from 'lucide-react';

export function ProtocolCard({ protocolAddress }: { protocolAddress: string }) {
  const { policy, loading, refreshPolicy } = useCoverage(protocolAddress);

  useEffect(() => {
    refreshPolicy();
  }, []);

  if (loading || !policy) {
    return <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse h-48" />;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="text-emerald-400" size={20} />
            AquaLend Coverage
          </h3>
          <p className="text-sm text-gray-400 mt-1">{protocolAddress.slice(0, 8)}...{protocolAddress.slice(-8)}</p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full border border-emerald-500/20">
          Active
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-400">Declared TVL</div>
          <div className="font-medium">{Number(policy.totalLockedValue) / 1e7} USDC</div>
        </div>
        <div>
          <div className="text-gray-400">Drain Threshold</div>
          <div className="font-medium text-red-400">{(policy.drainThresholdBps / 100).toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}
