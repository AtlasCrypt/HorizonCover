import { ShieldCheck, Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-emerald-400 to-sky-500 text-ink">
            <ShieldCheck size={17} strokeWidth={2.5} />
          </span>
          <div>
            <div className="text-sm font-semibold">HorizonCover</div>
            <div className="text-xs text-slate-500">Parametric DeFi insurance · MIT · open source</div>
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm text-slate-400">
          <a
            href="https://github.com/AtlasCrypt/HorizonCover"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Code2 size={16} />
            GitHub
          </a>
          <a
            href="https://github.com/AtlasCrypt/HorizonCover/issues"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            Contribute
          </a>
          <span className="text-slate-600">Built on Stellar</span>
        </div>
      </div>
    </footer>
  );
}
