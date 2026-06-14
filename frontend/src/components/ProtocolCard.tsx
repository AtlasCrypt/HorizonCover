import { useCoverage } from '../hooks/useCoverage';
import { Shield, AlertTriangle, Settings } from 'lucide-react';

const card = 'bg-gray-900 border border-gray-800 rounded-xl p-6';

export function ProtocolCard({ protocolAddress }: { protocolAddress: string }) {
  const { policy, status, error } = useCoverage(protocolAddress);

  if (status === 'unconfigured') {
    return (
      <div className={card}>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="text-gray-400" size={20} />
          No deployment configured
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          Set <code className="text-emerald-400">VITE_CORE_CONTRACT_ID</code> in{' '}
          <code className="text-emerald-400">.env.local</code> to load live policy data.
        </p>
      </div>
    );
  }

  if (status === 'loading') {
    return <div className={`${card} animate-pulse h-48`} />;
  }

  if (status === 'error' || !policy) {
    return (
      <div className={card}>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-red-400">
          <AlertTriangle size={20} />
          Could not load policy
        </h3>
        <p className="text-sm text-gray-400 mt-2 wrap-break-word">{error ?? 'No policy found.'}</p>
      </div>
    );
  }

  return (
    <div className={card}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="text-emerald-400" size={20} />
            Protocol Coverage
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {protocolAddress.slice(0, 8)}...{protocolAddress.slice(-8)}
          </p>
        </div>
        <div
          className={`px-3 py-1 text-sm rounded-full border ${
            policy.isSettled
              ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              : policy.isActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
        >
          {policy.isSettled ? 'Settled' : policy.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-400">Declared TVL</div>
          <div className="font-medium">{Number(policy.totalLockedValue) / 1e7} USDC</div>
        </div>
        <div>
          <div className="text-gray-400">Drain Threshold</div>
          <div className="font-medium text-red-400">
            {(policy.drainThresholdBps / 100).toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-gray-400">Max Benefit</div>
          <div className="font-medium">{Number(policy.maxBenefit) / 1e7} USDC</div>
        </div>
        <div>
          <div className="text-gray-400">Premium / Period</div>
          <div className="font-medium">{Number(policy.premiumPerPeriod) / 1e7} USDC</div>
        </div>
      </div>
    </div>
  );
}
