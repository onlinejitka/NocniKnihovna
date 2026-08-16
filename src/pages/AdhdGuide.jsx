import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Brain, Sparkles, AlertCircle, Clock, BatteryCharging, CheckCircle2, Heart } from 'lucide-react';

export default function AdhdGuide() {
  // Cesta k detailu produktu v e-shopu
  const productUrl = '/eshop/ADHD-ledovec';

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 px-4">
      
      {/* HERO SEKCE S TLAČÍTKEM DO E-SHOPU */}
      <div className="bg-[#0d1117] border border-[#c3a06a]/30 rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c3a06a]/10 border border-[#c3a06a]/30 text-[#c3a06a] text-xs font-semibold">
          <Brain className="w-4 h-4" /> Neurodivergentní průvodce zdarma
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide uppercase">
          ADHD <span className="text-[#c3a06a]">Ledovec</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Ucelený vizuální průvodce podstatou ADHD mozku[cite: 1]. Zjistěte, co se skrývá pod hladinou viditelných projevů a jak pracovat s vlastní neurologií bez pocitů viny[cite: 1].
        </p>

        <div className="pt-2">
          <Link
            to={productUrl}
            className="inline-flex items-center gap-3 bg-[#c3a06a] hover:bg-[#b28f59] text-[#0a0e14] font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-[#c3a06a]/20 uppercase tracking-wider text-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            Získat zdarma v e-shopu: ADHD Ledovec
          </Link>
        </div>
      </div>

      {/* KLÍČOVÉ POZNATKY Z DOKUMENTU */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* CO JE A CO NENÍ ADHD */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#c3a06a] flex items-center gap-2 font-serif">
            <AlertCircle className="w-5 h-5" /> Co je a NENÍ ADHD?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            ADHD je celoživotní neurovývojové onemocnění spojené s odlišnou hladinou dopaminu a noradrenalinu v prefrontální kůře.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 pt-1">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span> NENÍ to selhání výchovy ani nedostatku vůle.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span> NENÍ to způsobeno sladkostmi ani displeji.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Je to organická porucha chemického paliva mozku.
            </li>
          </ul>
        </div>

        {/* NEUROLOGICKÁ PODSTATA */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#c3a06a] flex items-center gap-2 font-serif">
            <BatteryCharging className="w-5 h-5" /> Pod hladinou ledovce
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Okolí vidí prokrastinaci a neklid. Uvnitř však probíhá:
          </p>
          <ul className="text-xs text-slate-400 space-y-2 pt-1">
            <li className="flex items-start gap-2">
              <span className="text-[#c3a06a]">•</span> <strong>Dopaminový deficit:</strong> Chemické ticho při nudných úkolech.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c3a06a]">•</span> <strong>Exekutivní paralýza:</strong> Fyzická nemožnost začít pracovat.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c3a06a]">•</span> <strong>Skotom času:</strong> Vnímání času pouze jako "TEĎ" nebo "NĚKDY JINDY".
            </li>
          </ul>
        </div>

      </div>

      {/* RÝCHLE MIKRO-KROKY PRO ÚLEVU */}
      <div className="bg-[#161b22] border border-[#c3a06a]/20 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c3a06a]" /> Jak překonat exekutivní paralýzu?
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-[#c3a06a] uppercase">1. Pravidlo 2 minut</h3>
            <p className="text-[11px] text-slate-400">Naplánujte si pouze mikro-krok (např. odnést jednu skleničku). Prvotní dopamin nastartuje další akce.</p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-[#c3a06a] uppercase">2. Fyzické dvojče</h3>
            <p className="text-[11px] text-slate-400">Pracujte v přítomnosti další osoby (body doubling). Zvyšuje to noradrenalin a usnadňuje fokus.</p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-[#c3a06a] uppercase">3. Hnědý šum</h3>
            <p className="text-[11px] text-slate-400">Poslech hnědého šumu (Brown Noise) pomáhá vypnout vnitřní monolog a zklidnit smysly (najdete ho i v našich nahrávkách pro ADHD).</p>
          </div>
        </div>
      </div>

    </div>
  );
}
