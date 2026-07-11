import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

export default function Hadanky() {
  const [allRiddles, setAllRiddles] = useState([]);
  const [currentRiddles, setCurrentRiddles] = useState([]);
  const [riddleAge, setRiddleAge] = useState('3-5');
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Načtení všech hádanek z Notion přes API
  useEffect(() => {
    setLoading(true);
    fetch('/api/get-riddles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllRiddles(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Chyba při načítání hádanek:", err);
        setLoading(false);
      });
  }, []);

  // 2. Filtrování a NÁHODNÉ PROMÍCHÁNÍ hádanek při změně věku nebo načtení dat
  useEffect(() => {
    // Vyfiltrujeme hádanky pro danou věkovou skupinu
    const filtered = allRiddles.filter(r => r.age === riddleAge);
    
    // Algoritmus pro dokonalé náhodné promíchání (Fisher-Yates Shuffle)
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Uložíme promíchané hádanky a restartujeme stav kvízu
    setCurrentRiddles(shuffled);
    setCurrentRiddleIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }, [riddleAge, allRiddles]);

  const currentRiddle = currentRiddles[currentRiddleIndex];

  const handleAnswerClick = (option) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === currentRiddle.answer) setScore(score + 1);
  };

  const handleNextRiddle = () => {
    setSelectedAnswer(null);
    if (currentRiddleIndex + 1 < currentRiddles.length) {
      setCurrentRiddleIndex(currentRiddleIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = (age) => {
    setRiddleAge(age);
  };

  return (
    <div class="max-w-2xl mx-auto bg-slate-900/30 border border-slate-800 p-6 md:p-10 rounded-2xl shadow-xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-amber-400 flex items-center justify-center space-x-2">
          <span>✨</span> <span>Pohádkové hádanky</span>
        </h2>
        <p class="text-slate-400 text-sm mt-1">Procvičte hlavičky před spaním</p>
      </div>

      {/* Přepínání věkových kategorií */}
      <div class="flex justify-center flex-wrap gap-2 mb-8">
        {[
          { id: '3-5', label: 'Mňauíci (3–5 let)' },
          { id: '6-9', label: 'Zkoumalové (6–9 let)' },
          { id: '10+', label: 'Chytrolíni (10+ let)' }
        ].map(cat => (
          <button 
            key={cat.id} 
            onClick={() => resetQuiz(cat.id)} 
            class={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${riddleAge === cat.id ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stav: Načítání */}
      {loading && (
        <div class="text-center py-12 text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div class="animate-spin inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full"></div>
          <p class="text-xs">Míchám hádanky v kouzelném klobouku...</p>
        </div>
      )}

      {/* Kvízová hra s náhodným pořadím */}
      {!loading && currentRiddle && (!quizFinished ? (
        <div class="space-y-6">
          <div class="flex justify-between items-center text-xs text-slate-500">
            <span>Hádanka {currentRiddleIndex + 1} z {currentRiddles.length}</span>
            <span>Skóre: {score}</span>
          </div>
          <div class="bg-slate-950/40 p-6 rounded-xl border border-slate-800/80 text-center min-h-[100px] flex items-center justify-center">
            <p class="text-lg md:text-xl font-medium text-slate-200 italic leading-relaxed">"{currentRiddle.question}"</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRiddle.options.map((option, idx) => {
              let btnStyle = "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800";
              let icon = null;
              if (selectedAnswer !== null) {
                if (option === currentRiddle.answer) {
                  btnStyle = "bg-green-500/20 text-green-300 border-green-500/50 font-bold";
                  icon = <CheckCircle2 size={16} class="text-green-400" />;
                } else if (option === selectedAnswer) {
                  btnStyle = "bg-red-500/20 text-red-300 border-red-500/50";
                  icon = <XCircle size={16} class="text-red-400" />;
                } else {
                  btnStyle = "bg-slate-900/40 text-slate-600 border-transparent opacity-50";
                }
              }
              return (
                <button 
                  key={idx} 
                  disabled={selectedAnswer !== null} 
                  onClick={() => handleAnswerClick(option)} 
                  class={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span> {icon}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <button onClick={handleNextRiddle} class="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg">
              {currentRiddleIndex + 1 === currentRiddles.length ? 'Vyhodnotit 🎉' : 'Další hádanka →'}
            </button>
          )}
        </div>
      ) : (
        <div class="text-center py-8 space-y-6">
          <div class="inline-flex bg-amber-400/10 text-amber-400 p-4 rounded-full"><Award size={48} /></div>
          <div>
            <h3 class="text-2xl font-bold text-amber-300">Skvělá práce!</h3>
            <p class="text-2xl font-black text-white mt-4 bg-slate-950/50 inline-block px-6 py-2 rounded-full border border-slate-800">{score} / {currentRiddles.length} správně</p>
          </div>
          <button onClick={() => resetQuiz(riddleAge)} class="w-full bg-slate-900 border border-slate-800 text-slate-300 py-3 rounded-xl font-semibold transition">Hrát znovu (promíchat) 🔄</button>
        </div>
      ))}

      {!loading && currentRiddles.length === 0 && (
        <div class="text-center text-slate-500 py-12">Zatím tu žádné hádanky pro tento věk publikované nejsou.</div>
      )}
    </div>
  );
}


{/* KOPÍRUJTE TENTO BLOK BANNERU PRO HRY A VLOŽTE JEJ NA KONEC SOUBORŮ HRA.JSX, SOUHVEZDI.JSX I PEXESO.JSX PŘED POSLEDNÍ </div> */}
<div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group mt-12">
  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500" />
  <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
    <div className="w-20 h-20 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-gradient-to-b from-slate-900 to-slate-950 text-amber-400/40">
      <Sparkles size={24} />
    </div>
    <div className="space-y-1.5 text-center sm:text-left">
      <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
        <Sparkles size={10} /> <span>Tip po hraní</span>
      </span>
      <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
        Hra pomalu skončila a očička jsou unavená. Pro klidný přesun do postýlce skvěle fungují milé plyšové hračky a usínáčci, kteří se stanou věrnými strážci krásných snových říší Vašich dětí.
      </p>
    </div>
  </div>
  <div className="shrink-0 w-full sm:w-auto self-center">
    <a href="https://www.alza.cz/hracky/pro-nejmenshi-plysaci/18851509.htm" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md">
      <ShoppingBag size={13} />
      <span>Prohlédnout hračky</span>
    </a>
  </div>
</div>
