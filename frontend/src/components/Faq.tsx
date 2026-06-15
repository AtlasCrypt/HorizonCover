import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is parametric insurance?',
    a: 'Cover that pays out based on a measurable condition rather than a human assessment. The policy defines the trigger and the formula up front, so when the condition is met the payout is automatic and there is nothing to dispute.',
  },
  {
    q: 'How is the payout amount decided?',
    a: 'It scales with severity. Once a drain crosses the policy threshold, the payout grows in proportion to how far past the threshold it went, up to the max benefit and capped to the capital the vault actually holds.',
  },
  {
    q: 'Is exploit detection automatic yet?',
    a: 'Not fully. Today a drain is reported by the monitor adapter, which is admin-gated in this MVP, and the vault verifies that report against the policy before paying. Making detection permissionless and fully on-chain is the main item on the roadmap.',
  },
  {
    q: 'Where does the payout money come from?',
    a: 'From the vault, which is funded by underwriters who deposit USDC as capital, plus the premiums protocols pay for their cover.',
  },
  {
    q: "What stops a normal withdrawal from triggering a payout?",
    a: 'Protocols can pre-register their planned withdrawals. The monitor checks that whitelist, so a routine treasury move is never mistaken for an exploit.',
  },
  {
    q: 'Is it live on mainnet?',
    a: 'No. It is an early, open-source MVP. The contracts are written and tested, the frontend runs in preview mode, and testnet deployment is one of the next steps.',
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Frequently asked</h2>
        <p className="mt-3 text-slate-400">The short version of how HorizonCover works.</p>
      </div>
      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <Item key={f.q} {...f} />
        ))}
      </div>
    </section>
  );
}
