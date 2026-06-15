import { ProtocolCard } from './ProtocolCard';
import { DEMO_PROTOCOL_ID, isConfigured } from '../config';
import { ShieldCheck, Layers, Coins } from 'lucide-react';

const sidePoints = [
  {
    icon: ShieldCheck,
    title: 'Capital-aware payouts',
    body: 'Every payout is capped to the capital the vault actually holds, so it can never promise more than it can pay.',
  },
  {
    icon: Layers,
    title: 'Vault + adapters',
    body: 'A neutral vault handles funds and math; adapters decide when to trigger. New triggers ship without touching the vault.',
  },
  {
    icon: Coins,
    title: 'Underwriter-backed',
    body: 'Liquidity providers deposit USDC to back policies and earn from premiums.',
  },
];

export function Dashboard() {
  return (
    <section id="dashboard" className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Live coverage</h2>
          <p className="mt-3 text-slate-400">
            A covered protocol's active policy, read straight from the chain.
          </p>
        </div>
        {!isConfigured() && (
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
            Preview mode · no deployment configured
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProtocolCard protocolAddress={DEMO_PROTOCOL_ID} />
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Why it's safe
          </h3>
          <ul className="mt-5 space-y-5">
            {sidePoints.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-emerald-400">
                  <p.icon size={17} />
                </span>
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-400">{p.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
