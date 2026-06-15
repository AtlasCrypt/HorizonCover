import { ShieldCheck } from 'lucide-react';
import { WalletButton } from './WalletButton';

const links = [
  { label: 'How it works', href: '#how' },
  { label: 'Coverage', href: '#dashboard' },
  { label: 'Simulator', href: '#simulator' },
  { label: 'Underwriters', href: '#underwriters' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-emerald-400 to-sky-500 text-ink shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Horizon<span className="text-gradient">Cover</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <WalletButton />
      </div>
    </header>
  );
}
