import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Sparkles, ArrowLeft } from 'lucide-react';

export default function Dekuji() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title') || 'Váš produkt';
  const fileUrl = searchParams.get('file');
  const type = searchParams.get('type');

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-emerald-400 shadow-2xl">
        <CheckCircle2 size={40} />
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Děkujeme za váš nákup!
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Platba proběhla úspěšně. Níže si můžete okamžitě stáhnout svůj tvořivý balíček <strong className="text-amber-300">{title}</strong>.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl space-y-6">
        {fileUrl ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Kliknutím na tlačítko se zahájí stahování souboru:</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl transition cursor-pointer shadow-lg shadow-amber-500/10 w-full"
            >
              <Download size={18} />
              <span>Stáhnout PDF soubor</span>
            </a>
          </div>
        ) : (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs">
            ✨ Děkujeme! Pokud jste zakoupili VIP přístup, vaše výhody byly aktivovány.
          </div>
        )}
      </div>

      <div>
        <Link to="/eshop" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-amber-300 transition">
          <ArrowLeft size={14} />
          <span>Zpět do obchůdku</span>
        </Link>
      </div>
    </div>
  );
}
