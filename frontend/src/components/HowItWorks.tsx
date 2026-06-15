import { FileSignature, Radar, Banknote } from 'lucide-react';

const steps = [
  {
    icon: FileSignature,
    title: 'A protocol buys cover',
    body: 'It sets a threshold (e.g. 30% of TVL) and a max benefit, then pays a premium. Underwriters supply the capital that backs payouts.',
  },
  {
    icon: Radar,
    title: 'A drain is reported',
    body: 'The Fund Flow Monitor reports a drain to the vault. Pre-registered normal withdrawals are whitelisted so routine moves never count as an exploit.',
  },
  {
    icon: Banknote,
    title: 'The vault pays out',
    body: 'The contract verifies the report against the policy, computes a payout scaled to severity, and settles in USDC — capped to the capital it holds.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How it works</h2>
        <p className="mt-3 text-slate-400">
          Two contracts, kept separate on purpose: a vault that holds funds and runs the math, and
          adapters that decide when to trigger it.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="card card-glow p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-400">
                <s.icon size={20} />
              </span>
              <span className="font-mono text-sm text-slate-600">0{i + 1}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
