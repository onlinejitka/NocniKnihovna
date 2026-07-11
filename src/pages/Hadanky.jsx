import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, ShoppingBag, Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

// Pomocná funkce pro náhodné zamíchání pole (Fisher-Yates algoritmus)
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function Hadanky() {
  const [allRiddles, setAllRiddles] = useState([]);
  const [shuffledRiddles, setShuffledRiddles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState(""); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState(null);
  const [categoryCompleted, setCategoryCompleted] = useState(false);

  // 1. Načtení kompletních hádanek z Notion databáze
  useEffect(() => {
    fetch('/api/get-riddles')
      .then(res => {
        if (!res.ok) throw new Error('Nepodařilo se načíst hádanky.');
        return res.json();
      })
      .then(data => {
        if (data && data.items && data.items.length > 0) {
          setAllRiddles(data.items);
          
          // Zjistíme dostupné věkové kategorie a nastavíme výchozí
          const uniqueAges = [...new Set(data.items.map(r => r.ageGroup))].sort();
          if (uniqueAges.includes("3 5 let")) {
            setActiveTab("3 5 let");
          } else if (uniqueAges.length > 0) {
            setActiveTab(uniqueAges[0]);
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

  // 2. Kdykoliv se změní věková kategorie (Záložka), hádanky vyfiltrujeme a náhodně zamícháme
  useEffect(() => {
    if (allRiddles.length > 0 && activeTab) {
      const filtered = allRiddles.filter(r => r.ageGroup === activeTab);
      setShuffledRiddles(shuffleArray(filtered));
      setCurrentIdx(0);
      setChosenAnswer(null);
      setCategoryCompleted(false);
    }
  }, [activeTab, allRiddles]);

  const handleOptionClick = (option) => {
    setChosenAnswer(option);
  };

  // Posun na další hádanku v zamíchaném pořadí
  const handleNextRiddle = () => {
    setChosenAnswer(null);
    if (currentIdx + 1 < shuffledRiddles.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCategoryCompleted(true);
    }
  };

  // Restartování aktuální kategorie (znovu zamíchá balíček)
  const handleRestartCategory = () => {
    const filtered = allRiddles.filter(r => r.ageGroup === activeTab);
    setShuffledRiddles(shuffleArray(filtered));
    setCurrentIdx(0);
    setChosenAnswer(null);
    setCategoryCompleted(false);
  };

  const ageGroups = [...new Set(allRiddles.map(r => r.ageGroup))].sort();
  const currentRiddle = shuffledRiddles[currentIdx];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Popis sekce */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Večerní hádanky pro bystré hlavičky
        </h2>
        <p className="text-slate-400 text-sm">
          Vyberte věkovou kategorii a postupně vyřešte všechny zamíchané rébusy. Další hádanka se odemkne vždy až po správné odpovědi.
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

      {!loading && !error && allRiddles.length > 0 && (
        <>
          {/* Výběr kategorie */}
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

          {/* VLASTNÍ PANEL PRO JEDNU AKTIVNÍ HÁDANKU */}
          <div className="max-w-2xl mx-auto pt-4 relative">
            {categoryCompleted ? (
              /* OBRAZOVKA HOTOVO: Všechny hádanky v kategorii úspěšně zdolány */
              <div className="bg-slate-900/40 border border-amber-500/20 p-8 rounded-3xl text-center space-y-4 animate-fade-in shadow-xl">
                <span className="text-4xl block filter drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">✨👑✨</span>
                <h3 className="text-xl font-serif font-bold text-amber-300">Všechny hádanky zdolány!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Úžasné! Dokázali jste správně vyřešit úplně všechny tajuplné rébusy v kategorii <strong>{activeTab}</strong>. Hlavička je teď krásně unavená a připravená na snovou říši.
                </p>
                <button
                  onClick={handleRestartCategory}
                  className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md mt-2"
                >
                  <RotateCcw size={14} />
                  <span>Zamíchat znovu a hrát od začátku</span>
                </button>
              </div>
            ) : currentRiddle ? (
              /* AKTIVNÍ JEDNA HÁDANKA */
              <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-lg animate-fade-in flex flex-col justify-between">
                
                {/* Ukazatel postupu (např. Hádanka 1 z 12) */}
                <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-slate-500 border-b border-slate-900 pb-3">
                  <span>Pořadí rébusu</span>
                  <span className="text-amber-400/80 font-bold">{currentIdx + 1} / {shuffledRiddles.length}</span>
                </div>

                {/* Otázka */}
                <div className="flex items-start space-x-3.5 pt-2">
                  <HelpCircle size={24} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-base md:text-lg font-medium text-slate-200 font-serif italic leading-relaxed">
                    „{currentRiddle.question}“
                  </p>
                </div>

                {/* Mřížka čtyř možností (A, B, C, D) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {currentRiddle.options.map((option) => {
                    const isSelected = chosenAnswer === option;
                    const isCorrect = option === currentRiddle.correctAnswer;
                    
                    let btnStyle = "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60";
                    if (isSelected) {
                      btnStyle = isCorrect 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                        : "bg-red-500/10 border-red-500 text-red-300 font-bold";
                    }

                    // Pokud už je uhodnuto správně, zablokujeme ostatní klikání
                    const isAnyCorrectAnswerGuessed = chosenAnswer === currentRiddle.correctAnswer;

                    return (
                      <button
                        key={option}
                        disabled={isAnyCorrectAnswerGuessed && !isSelected}
                        onClick={() => handleOptionClick(option)}
                        className={`px-4 py-3 rounded-xl border text-xs md:text-sm text-left transition duration-200 cursor-pointer flex items-center justify-between min-h-[48px] ${btnStyle} ${
                          isAnyCorrectAnswerGuessed && !isSelected ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && (
                          isCorrect ? <CheckCircle2 size={16} className="text-emerald-400 ml-2 shrink-0" /> : <XCircle size={16} className="text-red-400 ml-2 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* VALIDACE + TLAČÍTKO PRO POSUN VPŘED */}
                {chosenAnswer && (
                  <div className="pt-4 border-t border-slate-900/60 flex flex-col items-center space-y-4 animate-fade-in">
                    <div className={`p-3 rounded-xl text-xs md:text-sm font-medium text-center w-full ${
                      chosenAnswer === currentRiddle.correctAnswer ? 'bg-emerald-500/5 text-emerald-400' : 'bg-red-500/5 text-red-400/90'
                    }`}>
                      {chosenAnswer === currentRiddle.correctAnswer 
                        ? "✨ Skvěle! To je správná odpověď. Jste moc šikovní!" 
                        : "Očička vedle, zkusíte najít jinou možnost?"}
                    </div>

                    {/* Tlačítko dál se ukáže POUZE při správné odpovědi */}
                    {chosenAnswer === currentRiddle.correctAnswer && (
                      <button
                        onClick={handleNextRiddle}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-6 py-3 rounded-xl uppercase tracking-wide transition cursor-pointer shadow-lg hover:opacity-95"
                      >
                        <span>{currentIdx + 1 === shuffledRiddles.length ? "Dokončit hádanky" : "Další hádanka"}</span>
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </>
      )}

      {/* Spodní tematický Affiliate Banner */}
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
          <a href="https://www.alza.cz/hracky/vzdelavaci-a-naucne-hracky/18857199.htm?idp=23293" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md">
            <ShoppingBag size={13} />
            <span>Zobrazit hry a rébusy</span>
          </a>
        </div>
      </div>
    </div>
  );
}
