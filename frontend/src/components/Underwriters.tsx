import { TrendingUp, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Earn from premiums',
    body: 'Protocols pay premiums into the vault every period. Underwriters who back the pool earn from that flow.',
  },
  {
    icon: ShieldCheck,
    title: 'Capped exposure',
    body: 'Payouts are computed by fixed rules and capped to the vault balance, so the math is transparent up front.',
  },
  {
    icon: Wallet,
    title: 'On-chain, non-custodial',
    body: 'Capital sits in the Soroban vault contract, not with a company. Deposits and accounting are on-chain.',
  },
];

export function Underwriters() {
  return (
    <section id="underwriters" className="mx-auto max-w-6xl px-6 py-16">
      <div className="card card-glow overflow-hidden">
        <div className="grid gap-10 p-8 md:grid-cols-2 md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-3 py-1 text-xs font-medium text-sky-300">
              For liquidity providers
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight md:text-3xl">
              Back the vault, <span className="text-gradient">earn the premiums</span>
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              Premiums alone can't cover a large payout, so the vault is backed by underwriters who
              deposit USDC as capital. In return they share in the premiums protocols pay for cover.
              It's the supply side of the marketplace.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/AtlasCrypt/HorizonCover/issues/2"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                Deposits & withdrawals roadmap
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <span className="text-xs text-slate-500">
                `deposit_liquidity` is live; withdrawals are in progress.
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 rounded-2xl border border-white/5 bg-white/2 p-5"
              >
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-emerald-400">
                  <b.icon size={18} />
                </span>
                <div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-400">{b.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
