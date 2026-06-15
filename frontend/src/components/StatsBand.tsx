import { useVault } from '../hooks/useVault';
import { Coins, Globe, Timer, CircleDollarSign } from 'lucide-react';

function formatUsdc(stroops: bigint): string {
  return `$${(Number(stroops) / 1e7).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function StatsBand() {
  const { balance, status } = useVault();

  const vaultValue =
    status === 'ready' && balance !== null
      ? formatUsdc(balance)
      : status === 'error'
        ? 'Error'
        : status === 'loading'
          ? '…'
          : '—';

  const stats = [
    {
      icon: Coins,
      label: 'Vault balance',
      value: vaultValue,
      hint: status === 'unconfigured' ? 'Preview mode' : 'On-chain',
    },
    { icon: Globe, label: 'Network', value: 'Testnet', hint: 'Stellar · Soroban' },
    { icon: Timer, label: 'Settlement', value: '~5s', hint: 'Stellar finality' },
    { icon: CircleDollarSign, label: 'Payout asset', value: 'USDC', hint: 'Native on Stellar' },
  ];

  return (
    <section className="mx-auto -mt-6 max-w-6xl px-6">
      <div className="card card-glow grid grid-cols-2 divide-white/5 md:grid-cols-4 md:divide-x">
        {stats.map((s) => (
          <div key={s.label} className="flex items-start gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-emerald-400">
              <s.icon size={18} />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {s.label}
              </div>
              <div className="mt-0.5 truncate text-xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500">{s.hint}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
