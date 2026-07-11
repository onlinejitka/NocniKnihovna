import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Download, Sparkles, ShoppingBag, Lock } from 'lucide-react';

export default function Omalovanky() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCode = localStorage.getItem('sl_passcode') || '';
    fetch(`/api/get-library?passcode=${savedCode}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          // Zobrazí pouze položky, které obsahují nějakou omalovánku
          setItems(data.items.filter(item => item.urlOmalovankyHlavni || item.hasPremiumOmalovanky));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Kreativní omalovánky
        </h2>
        <p className="text-slate-400 text-sm">
          Stáhněte si naše ručně dočištěné snové šablony. Děti si mohou při poslechu pohádek vybarvovat a rozvíjet svou fantazii.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium">Připravuji papíry a pastelky...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-amber-500/40 transition-colors">
              <div className="aspect-video w-full overflow-hidden relative bg-slate-950 flex items-center justify-center p-6">
                <Palette size={48} className="text-slate-800" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{item.type}</p>
                </div>
                <div className="mt-5 space-y-2">
                  {item.urlOmalovankyHlavni && (
                    <a href={item.urlOmalovankyHlavni} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl transition">
                      <Download size={14} /> <span>Stáhnout PDF zdarma</span>
                    </a>
                  )}
                  {item.hasPremiumOmalovanky && (
                    <Link to={`/${item.slug}`} className="w-full flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition">
                      <Lock size={12} /> <span>Rozšířená sada (Premium)</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AFFILIATE BANNER PRO OMALOVÁNKY (Pastelky a tiskárny) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group mt-16 max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500" />
        <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
          <div className="w-20 h-20 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-gradient-to-b from-slate-900 to-slate-950 text-amber-400/40">
            <Palette size={24} />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
              <Sparkles size={10} /> <span>Doporučení pro tisk a tvorbu</span>
            </span>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
              Pro dokonalý kreativní zážitek doporučujeme kvalitní trojhranné pastelky s měkkou tuhou, které se dětem skvěle drží, nebo spolehlivé domácí tiskárny pro čistý tisk našich snových šablon.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto self-center">
          <a href="https://www.alza.cz/hracky/pastelky/18857283.htm" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md">
            <ShoppingBag size={13} />
            <span>Zobrazit na Alze</span>
          </a>
        </div>
      </div>
    </div>
  );
}
