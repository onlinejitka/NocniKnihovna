import React, { useState } from 'react';
import { HelpCircle, Sparkles, ShoppingBag, Eye, Brain } from 'lucide-react';

const RIDDLES_DATA = [
  {
    id: 1,
    question: "Nemá to rohy, ale trká to, nemá to nohy, ale utíká to. Co je to?",
    answer: "Potok nebo řeka."
  },
  {
    id: 2,
    question: "Ve dne je to malá louže, v noci to po nebi klouže. Svítí to na lesy i na křoví, celou noc lidem vypráví. Co je to?",
    answer: "Měsíček na obloze."
  },
  {
    id: 3,
    question: "Sedí panenka v komoře, rozčísla vlásky po dvoře. Sluší jí to v každé polévce, chutná klukovi i panence. Co je to?",
    answer: "Mrkev."
  },
  {
    id: 4,
    question: "Přichází tiše každou noc, zavírá očička na pomoc. Přinese pohádku, přinese sen, odejde, až když začne nový den. Co je to?",
    answer: "Spánek."
  }
];

export default function Hadanky() {
  const [revealedIds, setRevealedIds] = useState([]);

  const toggleReveal = (id) => {
    if (revealedIds.includes(id)) {
      setRevealedIds(revealedIds.filter(itemIdx => itemIdx !== id));
    } else {
      setRevealedIds([...revealedIds, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Popis sekce */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Večerní hádanky pro bystré hlavičky
        </h2>
        <p className="text-slate-400 text-sm">
          Zkuste s dětmi před spaním potrápit jazýček a schválně, jestli uhodnete naše snové rébusy. Kliknutím na hádanku se dozvíte správnou odpověď.
        </p>
      </div>

      {/* Seznam hádanek */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {RIDDLES_DATA.map((riddle) => {
          const isRevealed = revealedIds.includes(riddle.id);
          return (
            <div 
              key={riddle.id}
              className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-md hover:border-slate-700/60 transition duration-300"
            >
              <div className="flex items-start space-x-3">
                <HelpCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-slate-200 leading-relaxed font-serif italic">
                  „{riddle.question}“
                </p>
              </div>

              <div className="pt-2 flex flex-col space-y-2">
                {/* Schovaná/Odhalená odpověď */}
                <div className={`overflow-hidden transition-all duration-500 rounded-xl bg-slate-950/60 text-center ${
                  isRevealed ? 'max-h-20 p-3 border border-slate-900/50' : 'max-h-0'
                }`}>
                  <p className="text-xs font-bold text-amber-300">
                    Správná odpověď: <span className="text-white font-serif italic block pt-1 text-sm">{riddle.answer}</span>
                  </p>
                </div>

                {/* Ovládací tlačítko */}
                <button
                  onClick={() => toggleReveal(riddle.id)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-amber-400 text-xs py-2 rounded-xl transition cursor-pointer border border-slate-800"
                >
                  <Eye size={12} />
                  <span>{isRevealed ? "Skrýt odpověď" : "Ukázat odpověď"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DEDIKOVANÝ AFFILIATE BANNER NA EDUKATIVNÍ A DESKOVÉ HRY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group mt-12">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500" />
        <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
          <div className="w-20 h-20 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-gradient-to-b from-slate-900 to-slate-950 text-amber-400/40">
            <Brain size={24} />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
              <Sparkles size={10} /> <span>Rozvíjíme dětskou logiku</span>
            </span>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
              Hádanky a kvízy skvěle rozvíjejí dětskou logiku, postřeh a soustředění. Pokud chcete podpořit zvídavost Vašich dětí, prozkoumejte nejlepší společenské stolní hry, rébusy a edukativní hračky pro celou rodinu.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto self-center">
          <a 
            href="https://www.alza.cz/hracky/spolecenske-hry/18851211.htm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md"
          >
            <ShoppingBag size={13} />
            <span>Zobrazit hry a rébusy</span>
          </a>
        </div>
      </div>
    </div>
  );
}
