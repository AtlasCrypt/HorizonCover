import { useState } from 'react';
import { calculatePayoutOffchain } from '@horizoncover/sdk';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

// Standalone "what-if" tool: runs the exact same payout math as the
// on-chain contract (via the shared SDK), so it works without a deployment.
const STROOPS = 10_000_000n;
const TVL_USDC = 100_000;
const MAX_BENEFIT_USDC = 10_000;
const THRESHOLD_BPS = 3_000; // 30%

const toStroops = (usdc: number) => BigInt(Math.round(usdc)) * STROOPS;
const fromStroops = (s: bigint) => Number(s / STROOPS);

export function PayoutSimulator() {
  const [drainUsdc, setDrainUsdc] = useState(45_000);

  const preview = calculatePayoutOffchain(
    toStroops(drainUsdc),
    toStroops(TVL_USDC),
    THRESHOLD_BPS,
    toStroops(MAX_BENEFIT_USDC),
  );
  const payout = fromStroops(preview.payoutAmount);
  const drainPct = (drainUsdc / TVL_USDC) * 100;
  const thresholdPct = THRESHOLD_BPS / 100;

  return (
    <div className="card card-glow overflow-hidden">
      <div className="border-b border-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Payout simulator</h3>
            <p className="mt-1 text-sm text-slate-400">
              Drag to simulate a drain. This runs the real on-chain formula.
            </p>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
              preview.willTrigger
                ? 'border-red-400/20 bg-red-400/10 text-red-300'
                : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
            }`}
          >
            {preview.willTrigger ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
            {preview.willTrigger ? 'Triggered' : 'Safe'}
          </span>
        </div>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="text-slate-400">Simulated drain</span>
              <span className="font-mono text-red-300">${drainUsdc.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={TVL_USDC}
              step={1000}
              value={drainUsdc}
              onChange={(e) => setDrainUsdc(Number(e.target.value))}
              className="w-full"
            />

            {/* Severity meter with the threshold marked */}
            <div className="relative mt-4 h-2.5 w-full rounded-full bg-white/5">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-amber-400 to-red-500"
                style={{ width: `${Math.min(drainPct, 100)}%` }}
              />
              <div
                className="absolute -top-1 bottom-[-0.25rem] w-px bg-slate-300"
                style={{ left: `${thresholdPct}%` }}
                title={`Threshold ${thresholdPct}%`}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Drain {drainPct.toFixed(0)}% of TVL</span>
              <span>Threshold {thresholdPct}%</span>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-white/5 bg-white/2 p-3">
              <dt className="text-xs text-slate-500">TVL</dt>
              <dd className="mt-0.5 font-semibold">${(TVL_USDC / 1000).toFixed(0)}k</dd>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/2 p-3">
              <dt className="text-xs text-slate-500">Max benefit</dt>
              <dd className="mt-0.5 font-semibold">${(MAX_BENEFIT_USDC / 1000).toFixed(0)}k</dd>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/2 p-3">
              <dt className="text-xs text-slate-500">Threshold</dt>
              <dd className="mt-0.5 font-semibold">{thresholdPct}%</dd>
            </div>
          </dl>
        </div>

        {/* Result */}
        <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-linear-to-br from-white/4 to-transparent p-6">
          <div className="text-sm text-slate-400">
            {preview.willTrigger ? 'Estimated payout' : 'Below threshold — no payout'}
          </div>
          <div className="mt-1 text-4xl font-extrabold tracking-tight">
            <span className={preview.willTrigger ? 'text-gradient' : 'text-slate-500'}>
              ${payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="ml-2 text-base font-medium text-slate-500">USDC</span>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs text-slate-500">
              <span>Share of max benefit</span>
              <span>{preview.payoutPercentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-sky-500 transition-all"
                style={{ width: `${preview.payoutPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
