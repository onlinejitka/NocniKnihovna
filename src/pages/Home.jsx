import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Play, Volume2, Sparkles, Baby, Moon, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 pb-16 font-body text-cream">
      
      {/* HERO SEKCE */}
      <section className="relative pt-12 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-accent/10 border border-amber-accent/30 text-amber-accent text-xs font-semibold mb-6">
          <Moon className="w-3.5 h-3.5" /> Oáza klidu pro přetíženou mysl
        </div>

        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-cream tracking-wide leading-tight mb-6">
          Prostor pro zklidnění mysli a spánek
        </h1>

        <p className="text-cream/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Sensory audio, hnědý šum a večerní příběhy vytvořené s porozuměním
          <p>pro přetížený a ADHD mozek dospělých i dětí.</p>
          <p>Informace o neurotypickém mozku.</p>
        </p>

        {/* HLAVNÍ CTA TLAČÍTKO */}
        <Link
          to="/adhd-pruvodce"
          className="inline-flex items-center gap-3 bg-amber-accent hover:bg-amber-accent/90 text-ink font-heading font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-amber-accent/20 uppercase tracking-wider text-sm"
          >
          <Download className="w-5 h-5" />
          Stáhnout zdarma: ADHD Ledovec (PDF)
        </Link>
      </section>

      {/* 2. ZABUDOVANÝ AUDIO PREHRÁVAČ PRO INSTANTNÍ ZÁŽITEK */}
      <section className="max-w-2xl mx-auto px-4">
        <div className="bg-ink border border-amber-accent/30 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
                 
          {/* TLAČÍTKO PROKLIKU NA YOUTUBE */}
<a
  href="https://www.youtube.com/watch?v=LjvoFP6hFj0"
  target="_blank"
  rel="noopener noreferrer"
  className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
  aria-label="Přehrát na YouTube"
>
  <Play className="w-7 h-7 ml-1" />
</a>

          <div className="space-y-1 text-center sm:text-left flex-grow">
            <span className="text-[11px] uppercase tracking-wider font-bold flex items-center justify-center sm:justify-start gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Okamžité zklidnění
            </span>
            <h3 className="text-white font-semibold text-lg">Noční vlak & Hnědý šum</h3>
            <p className="text-xs text-slate-400">Pusťte si mluvené slovo pro potlačení myšlenkového šumu a klidný spánek.</p>
                        <p className="text-xs text-slate-400">(odkaz na YouTube na mé mluvené slovo + brown noise + zvuk jedoucího vlaku)</p>

            

          </div>
        </div>
      </section>

      {/* 3. ROZCESTNÍK NA 2 HLAVNÍ VĚTVE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-xs uppercase font-bold tracking-widest text-center mb-8">
          Kam si přejete pokračovat?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* KARTA A: PRO DOSPĚLÉ & ADHD */}
           <div className="bg-ink border border-amber-accent/30 rounded-2xl p-8 flex flex-col justify-between space-y-6 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">Pro dospělé & ADHD</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nahrávky pro fokus, hnědý šum, zvuky Botanické zahrady a vědomá sensory audia navržená pro zastavení přetížené mysli.
              </p>
            </div>
            <Link
              to="/audio"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-accent uppercase tracking-wider group-hover:translate-x-1 transition-transform"
            >
              Vstoupit do audio sekce <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* KARTA B: PRO DĚTI & RODIČE */}
          <div className="bg-ink border border-amber-accent/30 rounded-2xl p-8 flex flex-col justify-between space-y-6 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">Pro děti & Rodiče</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Večerní pohádky bez divokého dramatu + **Dětský hravý koutek** s omalovánkami, počítáním oveček a generátorem pohádek na míru.
              </p>
            </div>
            <Link
              to="/pro-deti"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-accent uppercase tracking-wider group-hover:translate-x-1 transition-transform"
            >
              Prozkoumat dětský svět <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. NABÍDKA E-SHOPU (DOLE NA STRÁNCE) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-ink border border-amber-accent/30 rounded-2xl p-8 flex flex-col justify-between space-y-6 transition-all group">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c3a06a]">E-shop & Materiály</span>
            <h3 className="text-2xl font-serif font-bold text-white">ADHD Mega Bundle & Pracovní listy</h3>
            <p className="text-sm text-slate-400 max-w-lg">
              Kompletní tištěné i digitální sady pracovních listů, strategie pro zvládání senzorického přetížení a prémiové audio balíčky.
            </p>
            <div className="pt-2">
              <Link
                to="/eshop"
                className="inline-flex items-center gap-3 bg-amber-accent hover:bg-amber-accent/90 text-ink font-heading font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-amber-accent/20 uppercase tracking-wider text-sm"
          >
                Prohlédnout produkty v E-shopu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
