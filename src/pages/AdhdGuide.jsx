import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Brain, Sparkles, AlertCircle, BatteryCharging } from 'lucide-react';

export default function AdhdGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 px-4 font-body text-cream">
      
      {/* HERO SEKCE */}
      <div className="bg-ink border border-amber-accent/30 rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-accent/10 border border-amber-accent/30 text-amber-accent text-xs font-semibold">
          <Brain className="w-4 h-4" /> Neurodivergentní průvodce zdarma
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-cream tracking-wide uppercase">
          ADHD <span className="text-amber-accent">Ledovec</span>
        </h1>

        <p className="text-cream/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Ucelený vizuální průvodce podstatou ADHD mozku. Zjistěte, co se skrývá pod hladinou viditelných projevů a jak pracovat s vlastní neurologií bez pocitů viny.
        </p>

        <div className="pt-2">
          <Link
            to="/eshop/ADHD-ledovec"
            className="inline-flex items-center gap-3 bg-amber-accent hover:bg-amber-accent/90 text-ink font-heading font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-amber-accent/20 uppercase tracking-wider text-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            Získat zdarma v e-shopu: ADHD Ledovec
          </Link>
        </div>
      </div>

      {/* OBSAH LEDOVCE */}
      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="bg-ink border border-cream/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-heading font-bold text-amber-accent flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-accent" /> Co je a NENÍ ADHD?
          </h2>
          <p className="text-xs text-cream/80 leading-relaxed">
            ADHD je celoživotní neurovývojové onemocnění spojené s odlišnou hladinou dopaminu a noradrenalinu v prefrontální kůře.
          </p>
          <ul className="text-xs text-cream/70 space-y-2 pt-1">
            <li className="flex items-start gap-2">
              <span className="text-teal-sage font-bold">✓</span> NENÍ to selhání výchovy ani nedostatku vůle.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-sage font-bold">✓</span> NENÍ to způsobeno sladkostmi ani displeji.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-sage font-bold">✓</span> Je to organická porucha chemického paliva mozku.
            </li>
          </ul>
        </div>

        <div className="bg-ink border border-cream/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-heading font-bold text-amber-accent flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-amber-accent" /> Pod hladinou ledovce
          </h2>
          <p className="text-xs text-cream/80 leading-relaxed">
            Okolí vidí prokrastinaci a neklid. Uvnitř však probíhá:
          </p>
          <ul className="text-xs text-cream/70 space-y-2 pt-1">
            <li className="flex items-start gap-2">
              <span className="text-amber-accent">•</span> <strong>Dopaminový deficit:</strong> Chemické ticho při nudných úkolech.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-accent">•</span> <strong>Exekutivní paralýza:</strong> Fyzická nemožnost začít pracovat.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-accent">•</span> <strong>Skotom času:</strong> Vnímání času pouze jako "TEĎ" nebo "NĚKDY JINDY".
            </li>
          </ul>
        </div>

      </div>

      {/* STRATEGIE */}
      <div className="bg-ink border border-amber-accent/20 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-heading font-bold text-cream flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-accent" /> Jak překonat exekutivní paralýzu?
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-ink/50 p-4 rounded-lg border border-cream/10 space-y-1">
            <h3 className="text-xs font-heading font-bold text-amber-accent uppercase">1. Pravidlo 2 minut</h3>
            <p className="text-[11px] text-cream/70">Zadejte si pouze mikro-krok (např. odnést 1 skleničku). První dopamin nastartuje další akce.</p>
          </div>

          <div className="bg-ink/50 p-4 rounded-lg border border-cream/10 space-y-1">
            <h3 className="text-xs font-heading font-bold text-amber-accent uppercase">2. Tělesné dvojče</h3>
            <p className="text-[11px] text-cream/70">Pracujte v přítomnosti další osoby. Zvyšuje to noradrenalin a usnadňuje fokus.</p>
          </div>

          <div className="bg-ink/50 p-4 rounded-lg border border-cream/10 space-y-1">
            <h3 className="text-xs font-heading font-bold text-amber-accent uppercase">3. Hnědý šum</h3>
            <p className="text-[11px] text-cream/70">Poslech hnědého šumu (Brown Noise) pomáhá vypnout vnitřní monolog a zklidnit smysly.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
