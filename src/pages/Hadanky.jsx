import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, ShoppingBag, Brain, CheckCircle2, XCircle } from 'lucide-react';

export default function Hadanky() {
  const [riddles, setRiddles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState("3 5 let"); // Vychozi zalozka
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    fetch('/api/get-riddles')
      .then(res => {
        if (!res.ok) throw new Error('Nepodařilo se načíst hádanky.');
        return res.json();
      })
      .then(data => {
        if (data && data.items) {
          setRiddles(data.items);
          if (data.items.length > 0) {
             const uniqueAges = [...new Set(data.items.map(r => r.ageGroup))].sort();
             if (uniqueAges.includes("3 5 let")) setActiveTab("3 5 let");
             else if (uniqueAges.length > 0) setActiveTab(uniqueAges[0]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleOptionClick = (riddleId, option) => {
    setSelectedAnswers(prev => ({ ...prev, [riddleId]: option }));
  };

  const ageGroups = [...new Set(riddles.map(r => r.ageGroup))].sort();
  const filteredRiddles = riddles.filter(r => r.ageGroup === activeTab);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Večerní hádanky pro bystré hlavičky
        </h2>
        <p className="text-slate-400 text-sm">
          Vyberte věkovou kategorii a zkuste s dětmi najít správnou odpověď. Stačí klepnout na jednu z možností pod hádankou.
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium">Načítám tajemné rébusy z knihovny...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-10 text-red-400">
          <p>Omlouváme se, hádanky se nepodařilo načíst z databáze.</p>
        </div>
      )}

      {!loading && !error && riddles.length > 0 && (
        <>
          <div className="flex justify-center flex-wrap gap-3 border-b border-slate-900 pb-4">
            {ageGroups.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition tracking-wide cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
                }`}
              >
                Kategorie: {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 pt-4 animate-fade-in">
            {filteredRiddles.map((riddle) => {
              const chosen = selectedAnswers[riddle.id];

              return (
                <div key={riddle.id} className="bg-slate-900/40 border border-slate-800 p-5 md:p-6 rounded-2xl space-y-4 shadow-md transition duration-300">
                  <div className="flex items-start space-x-3">
                    <HelpCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-base font-medium text-slate-200 font-serif italic">
                      „{riddle.question}“
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
                    {riddle.options.map((option) => {
                      const isSelected = chosen === option;
                      const isCorrect = option === riddle.correctAnswer;
                      
                      let btnStyle = "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60";
                      if (isSelected) {
                        btnStyle = isCorrect ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold" : "bg-red-500/10 border-red-500 text-red-300 font-bold";
                      }

                      return (
                        <button key={option} onClick={() => handleOptionClick(riddle.id, option)} className={`px-4 py-2.5 rounded-xl border text-xs text-left transition duration-200 cursor-pointer flex items-center justify-between ${btnStyle}`}>
                          <span>{option}</span>
                          {isSelected && (
                            isCorrect ? <CheckCircle2 size={14} className="text-emerald-400 ml-2 shrink-0" /> : <XCircle size={14} className="text-red-400 ml-2 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {chosen && (
                    <div className={`p-3 rounded-xl text-xs font-medium text-center animate-fade-in ${chosen === riddle.correctAnswer ? 'bg-emerald-500/5 text-emerald-400/90' : 'bg-red-500/5 text-red-400/90'}`}>
                      {chosen === riddle.correctAnswer ? "✨ Skvěle! To je správná odpověď. Jste moc šikovní." : "Očička vedle, zkusíte najít jinou možnost?"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Affiliate Banner */}
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
          <a href="https://www.alza.cz/hracky/spolecenske-hry/18851211.htm" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md">
            <ShoppingBag size={13} />
            <span>Zobrazit hry a rébusy</span>
          </a>
        </div>
      </div>
    </div>
  );
}
