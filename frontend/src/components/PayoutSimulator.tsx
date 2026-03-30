import { useState } from 'react';

export function PayoutSimulator() {
  const [drainAmount, setDrainAmount] = useState(0);
  const tvl = 100000;
  const threshold = 30000; // 30%
  const maxBenefit = 10000;
  
  let payout = 0;
  if (drainAmount > threshold) {
    payout = maxBenefit * ((drainAmount - threshold) / (tvl - threshold));
  }
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Payout Simulator</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Simulate Hack Amount</span>
            <span className="font-mono text-red-400">${drainAmount.toLocaleString()} USDC</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={tvl} 
            value={drainAmount} 
            onChange={(e) => setDrainAmount(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
        
        <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Estimated Automatic Payout</div>
          <div className="text-3xl font-bold text-emerald-400">
            ${Math.min(payout, maxBenefit).toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm text-gray-500 font-normal">USDC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
