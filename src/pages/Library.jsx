import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const riddles = {
  "3-5":, c: 0 },
    { q: "Bílý pán na dvorku stojí, teplého sluníčka se bojí. Co je to?", a:, c: 0 },
    { q: "Hlídá dům a štěká k tomu, zloděje nepustí domů. Co je to?", a: ["Pes", "Kočka", "Koza"], c: 0 },
    { q: "Zlaté kolo na obloze svítí, hřeje lidi, stromy, kvítí. Co je to?", a:, c: 0 },
    { q: "Leze, leze po zahradě, domeček si nosí na zádech. Co je to?", a: ["Šnek", "Ježek", "Žába"], c: 0 }
  ],
  "6-9":, c: 0 },
    { q: "Nemá nohy, a přece běží, nemá jazyk, a přece šumí. Co je to?", a: ["Potok / Voda", "Vítr", "Auto"], c: 0 },
    { q: "Listy má a strom to není, vypráví a ústa nemá. Co je to?", a:, c: 0 },
    { q: "Nemá nohy, a přece jde, nemá ruce, a přece ukazuje. Co je to?", a: ["Hodiny", "Kompas", "Cesta"], c: 0 }
  ],
  "10-15":, c: 0 },
    { q: "Slyšíš mě, i když mě nevidíš, odpovím ti, jen když promluvíš. Co jsem?", a:, c: 0 },
    { q: "Dá se to snadno zlomit, i když na to vůbec nesáhneš. Co je to?", a:, c: 0 },
    { q: "Když vyslovíš mé jméno, v tu ránu mě zničíš. Co jsem?", a:, c: 0 }
  ]
};

function RiddleGenerator() {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const = useState(0);
  const = useState(null);
  const = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startCategory = (cat) => {
    const selected = [...riddles[cat]].sort(() => 0.5 - Math.random()).slice(0, 5);
    setCategory(cat);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsFinished(false);
  };

  const handleAnswer = (idx) => {
    if (selectedAnswer!== null) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    if (idx === questions[currentIndex].c) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="w-full bg-[#131520] border border-[#c084fc]/10 p-6 rounded-3xl shadow-xl text-center max-w-2xl mx-auto">
      <span className="text-3xl">🧩</span>
      <h2 className="serif text-2xl font-semibold text-white mt-2 mb-4">Noční hádankář</h2>
      <p className="text-xs text-[#94a3b8] mb-6">Vyberte věk děťátka a potrapte bystré hlavičky!</p>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {["3-5", "6-9", "10-15"].map(cat => (
          <button 
            key={cat}
            onClick={() => startCategory(cat)}
            className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
              category === cat 
               ? "bg-[#c084fc] text-[#090a10] border-[#c084fc]" 
                : "bg-[#1b1e2e] text-[#94a3b8] border-[#c084fc]/5 hover:border-[#c084fc]/40"
            }`}
          >
            {cat} let
          </button>
        ))}
      </div>

      {category &&!isFinished && (
        <div className="min-h-[200px] flex flex-col justify-between">
          <div className="mb-6">
            <span className="text-xs text-[#c084fc] font-semibold uppercase tracking-wider">Hádanka {currentIndex + 1} z 5</span>
            <p className="serif text-lg text-white mt-2 leading-relaxed">{questions[currentIndex]?.q}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-6">
            {questions[currentIndex]?.a.map((option, idx) => {
              let btnClass = "w-full p-4 bg-[#1b1e2e] text-white border border-[#c084fc]/5 rounded-xl text-sm text-left hover:bg-[#252a3f] transition-all";
              if (selectedAnswer!== null) {
                if (idx === questions[currentIndex].c) {
                  btnClass = "w-full p-4 bg-emerald-500/20 border-emerald-500 text-emerald-300 rounded-xl text-sm text-left transition-all";
                } else if (idx === selectedAnswer) {
                  btnClass = "w-full p-4 bg-rose-500/20 border-rose-500 text-rose-300 rounded-xl text-sm text-left transition-all";
                } else {
                  btnClass = "w-full p-4 bg-[#1b1e2e] text-white border border-[#c084fc]/5 rounded-xl text-sm text-left opacity-40 transition-all";
                }
              }
              return (
                <button 
                  key={idx} 
                  disabled={selectedAnswer!== null} 
                  onClick={() => handleAnswer(idx)} 
                  className={btnClass}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="text-center mb-4">
              <p className={selectedAnswer === questions[currentIndex].c? "text-emerald-400 text-sm font-semibold" : "text-rose-400 text-sm font-semibold"}>
                {selectedAnswer === questions[currentIndex].c? "🎉 Správně! Jsi šikula." : `😢 Nevadí. Správná odpověď byla: ${questions[currentIndex].a[questions[currentIndex].c]}.`}
              </p>
              <button 
                onClick={nextQuestion} 
                className="mt-4 w-full py-3 bg-[#c084fc] text-[#090a10] font-bold rounded-xl hover:bg-[#d8b4fe] transition-colors"
              >
                Další hádanka →
              </button>
            </div>
          )}
        </div>
      )}

      {isFinished && (
        <div className="py-8">
          <span className="text-4xl">🏆</span>
          <h3 className="serif text-2xl font-bold text-white mt-2">Hádanky jsou u konce!</h3>
          <p className="text-sm text-[#94a3b8] mt-2">Dokončil jsi hádanky se skóre {score} z 5 bodů.</p>
          <button 
            onClick={() => startCategory(category)} 
            className="mt-6 px-6 py-2.5 bg-[#1b1e2e] text-white border border-[#c084fc]/20 rounded-xl hover:bg-[#c084fc] hover:text-[#090a10] text-xs font-bold transition-all"
          >
            Hrát znovu
          </button>
        </div>
      )}
    </div>
  );
}

export default function Library() {
  const [entries, setEntries] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-notion')
     .then(res => res.json())
     .then(data => {
        if (Array.isArray(data)) setEntries(data);
        setLoading(false);
      })
     .catch(err => {
        console.error("Failed to fetch library entries:", err);
        setLoading(false);
      });
  },);

  const pohadky = entries.filter(e => e.type === 'Pohádka');
  const rikadla = entries.filter(e => e.type === 'Říkadlo');
  const pisnicky = entries.filter(e => e.type === 'Písnička');

  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e1b4b]/30 via-[#090a10] to-[#090a10] -z-10 min-h-screen overflow-y-auto">
      <main className="max-w-4xl mx-auto px-4 py-16 w-full space-y-16">
        <header className="text-center">
          <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#c084fc]/30 shadow-[0_0_20px_rgba(192,132,252,0.15)] bg-[#1e1b4b] flex items-center justify-center text-4xl">
            🌙
          </div>
          <h1 className="serif text-4xl font-semibold tracking-wide text-white mb-2">Noční knihovna</h1>
          <p class="text-[#94a3b8] text-sm max-w-md mx-auto leading-relaxed">
            Klidné pohádky pro usínání dětí, lidová říkadla a bonusové písničky. Doprovázené hřejivou perokresbou.
          </p>
        </header>

        <RiddleGenerator />

        {loading? (
          <div className="text-center py-12">
            <p className="text-sm text-[#94a3b8]">Otevíráme brány knihovny...</p>
          </div>
        ) : (
          <>
            <section>
              <h2 className="serif text-3xl font-medium text-white mb-8 border-b border-[#c084fc]/10 pb-2">📖 Čtené pohádky</h2>
              {pohadky.length === 0? (
                <p className="text-sm text-[#64748b]">Pohádky pro vás zrovna připravujeme do poliček...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pohadky.map((p) => (
                    <article key={p.id} className="bg-[#131520] border border-[#c084fc]/5 rounded-3xl overflow-hidden transition-all duration-300 hover:border-[#c084fc]/20 flex flex-col justify-between">
                      {p.thumbnail && (
                        <img src={p.thumbnail} alt={p.title} className="w-full h-48 object-cover opacity-80" />
                      )}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="serif text-xl font-medium text-white mb-2">{p.title}</h3>
                          <p className="text-xs text-[#94a3b8] line-clamp-3 mb-4">{p.content}</p>
                        </div>
                        <Link to={`/pohadky/${p.slug}`} className="text-xs font-semibold text-[#c084fc] hover:text-[#d8b4fe] transition-colors">Číst pohádku a přehrát audio →</Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="serif text-3xl font-medium text-white mb-8 border-b border-[#c084fc]/10 pb-2">🌸 Říkadla a básničky</h2>
              {rikadla.length === 0? (
                <p className="text-sm text-[#64748b]">Básničky a říkadla se pro vás právě chystají.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {rikadla.map((r) => (
                    <Link key={r.id} to={`/rikadla/${r.slug}`} className="p-5 bg-[#131520] border border-[#c084fc]/5 hover:border-[#c084fc]/30 rounded-2xl transition-all block">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c084fc]">{r.category}</span>
                      <h3 className="serif text-lg font-medium text-white mt-1">{r.title}</h3>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="serif text-3xl font-medium text-white mb-8 border-b border-[#c084fc]/10 pb-2">🎵 Písničky s doprovodem</h2>
              {pisnicky.length === 0? (
                <p className="text-sm text-[#64748b]">Písničky se pro vás právě ladí.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pisnicky.map((s) => (
                    <div key={s.id} className="p-6 bg-[#131520] border border-[#c084fc]/5 rounded-2xl flex justify-between items-center w-full">
                      <div>
                        <h3 className="serif text-lg font-medium text-white">{s.title}</h3>
                        <p className="text-xs text-[#64748b] mt-1">Zpívaný bonus na Herohero</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/pisnicky/${s.slug}`} className="px-3 py-1.5 bg-[#1b1e2e] text-xs font-semibold rounded-lg hover:bg-[#252a3f] text-[#c084fc]">Text</Link>
                        {s.herohero && (
                          <a href={s.herohero} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#c084fc]/20 text-[#e9d5ff] text-xs font-semibold rounded-lg hover:bg-[#c084fc]/30">Poslech ✨</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="w-full text-center py-8 text-xs text-[#475569] border-t border-[#c084fc]/5 mt-16 bg-[#06070a]/50">
        <p>© 2026 Noční knihovna. Všechna práva vyhrazena.</p>
      </footer>
    </div>
  );
}
