import { ArrowRight, Zap, Lock, Activity } from 'lucide-react';

const points = [
  { icon: Zap, text: 'Settles in seconds' },
  { icon: Lock, text: 'Math-enforced payouts' },
  { icon: Activity, text: 'No claims, no votes' },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Parametric insurance on Stellar · Soroban
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          Insurance for DeFi that pays out the{' '}
          <span className="text-gradient">moment it's needed</span>.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          When a covered protocol is drained past its threshold, HorizonCover calculates the payout
          on-chain and settles it in USDC. No claims forms, no adjusters, no governance vote — the
          rules are fixed when the policy is written.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#simulator"
            className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-400 to-sky-500 px-5 py-3 text-sm font-semibold text-ink shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02]"
          >
            Try the payout simulator
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
          >
            How it works
          </a>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {points.map((p) => (
            <div key={p.text} className="flex items-center gap-2 text-sm text-slate-400">
              <p.icon size={16} className="text-emerald-400" />
              {p.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
