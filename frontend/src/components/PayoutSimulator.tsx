import { useState } from 'react';
import { calculatePayoutOffchain } from '@horizoncover/sdk';

// Standalone "what-if" tool: runs the exact same payout math as the
// on-chain contract (via the shared SDK), so it works without a deployment.
const STROOPS = 10_000_000n;
const TVL_USDC = 100_000;
const MAX_BENEFIT_USDC = 10_000;
const THRESHOLD_BPS = 3_000; // 30%

const toStroops = (usdc: number) => BigInt(Math.round(usdc)) * STROOPS;
const fromStroops = (s: bigint) => Number(s / STROOPS);

export function PayoutSimulator() {
  const [drainUsdc, setDrainUsdc] = useState(0);

  const preview = calculatePayoutOffchain(
    toStroops(drainUsdc),
    toStroops(TVL_USDC),
    THRESHOLD_BPS,
    toStroops(MAX_BENEFIT_USDC),
  );
  const payout = fromStroops(preview.payoutAmount);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Payout Simulator</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Simulate Hack Amount</span>
            <span className="font-mono text-red-400">${drainUsdc.toLocaleString()} USDC</span>
          </div>
          <input
            type="range"
            min="0"
            max={TVL_USDC}
            value={drainUsdc}
            onChange={(e) => setDrainUsdc(Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Drain ratio: {(preview.drainRatioBps / 100).toFixed(1)}%</span>
            <span>Threshold: {(THRESHOLD_BPS / 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">
            {preview.willTrigger ? 'Estimated Payout' : 'Below threshold — no payout'}
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            ${payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
            <span className="text-sm text-gray-500 font-normal">
              USDC ({preview.payoutPercentage}% of max)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
