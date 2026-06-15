import { useCoverage } from '../hooks/useCoverage';
import { Shield, AlertTriangle, Settings } from 'lucide-react';

const usdc = (v: bigint) => `${(Number(v) / 1e7).toLocaleString()} USDC`;

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/2 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${accent ?? ''}`}>{value}</div>
    </div>
  );
}

export function ProtocolCard({ protocolAddress }: { protocolAddress: string }) {
  const { policy, status, error } = useCoverage(protocolAddress);

  if (status === 'unconfigured') {
    return (
      <div className="card p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Settings className="text-slate-400" size={20} />
          No deployment configured
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          This panel shows a live policy once contracts are deployed. Set{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-emerald-300">
            VITE_CORE_CONTRACT_ID
          </code>{' '}
          and{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-emerald-300">
            VITE_DEMO_PROTOCOL_ID
          </code>{' '}
          in <code className="font-mono text-slate-300">.env.local</code> to load it.
        </p>
      </div>
    );
  }

  if (status === 'loading') {
    return <div className="card h-64 animate-pulse" />;
  }

  if (status === 'error' || !policy) {
    return (
      <div className="card p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400">
          <AlertTriangle size={20} />
          Could not load policy
        </h3>
        <p className="mt-3 text-sm text-slate-400">{error ?? 'No policy found for this address.'}</p>
      </div>
    );
  }

  const statusChip = policy.isSettled
    ? { label: 'Settled', cls: 'border-slate-500/20 bg-slate-500/10 text-slate-300' }
    : policy.isActive
      ? { label: 'Active', cls: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' }
      : { label: 'Inactive', cls: 'border-red-400/20 bg-red-400/10 text-red-300' };

  return (
    <div className="card card-glow p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-400">
            <Shield size={20} />
          </span>
          <div>
            <h3 className="text-lg font-semibold">Protocol coverage</h3>
            <p className="font-mono text-xs text-slate-500">
              {protocolAddress.slice(0, 8)}…{protocolAddress.slice(-8)}
            </p>
          </div>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusChip.cls}`}>
          {statusChip.label}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Metric label="Declared TVL" value={usdc(policy.totalLockedValue)} />
        <Metric
          label="Drain threshold"
          value={`${(policy.drainThresholdBps / 100).toFixed(2)}%`}
          accent="text-red-300"
        />
        <Metric label="Max benefit" value={usdc(policy.maxBenefit)} accent="text-emerald-300" />
        <Metric label="Premium / period" value={usdc(policy.premiumPerPeriod)} />
      </div>
    </div>
  );
}
