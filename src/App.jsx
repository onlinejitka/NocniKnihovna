import React, { useState, useEffect } from 'react';
import { BookOpen, Music, Sparkles, Youtube, ArrowLeft, HelpCircle, CheckCircle2, XCircle, Award } from 'lucide-react';

// Slovník pro správné české názvy záložek (odstranění chyb typu Pohádkay)
const TAB_LABELS = {
  'vse': 'Vše z knihovny',
  'Pohádka': 'Pohádky',
  'Říkadlo': 'Říkadla',
  'Písnička': 'Písničky'
};

const RIDDLES_DATA = {
  '3-5': [
    {
      question: 'Maličké je to, rádo sýr to jí, kočka se na to hnedka vyrojí. Co je to?',
      options: ['Zajíc', 'Myška', 'Medvěd', 'Pejsek'],
      answer: 'Myška'
    },
    {
      question: 'Červená je, sladká je, na sluníčku v trávě zraje. Trháme ji do pusinky. Co je to?',
      options: ['Švestka', 'Okurka', 'Jahůdka', 'Mrkev'],
      answer: 'Jahůdka'
    }
  ],
  '6-9': [
    {
      question: 'Sedí panenka v komoře, rozpuštěné zelené vlasy má nahoře a její oranžové tělo je schované v zemi. Co je to?',
      options: ['Cibule', 'Brambora', 'Mrkev', 'Řepa'],
      answer: 'Mrkev'
    },
    {
      question: 'Zuby má a nekouše, do vlásků se rád pouští, aby je učesal. Co je to?',
      options: ['Kartáček', 'Hřeben', 'Nůžky', 'Pila'],
      answer: 'Hřeben'
    }
  ],
  '10+': [
    {
      question: 'Čím víc z ní ubíráš a kopeš do hloubky, tím větší začíná být. Co je to?',
      options: ['Hora', 'Díra', 'Zeď', 'Písek'],
      answer: 'Díra'
    }
  ]
};

export default function App() {
  const [currentSection, setCurrentSection] = useState('library'); // library | riddles
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('vse');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stavy pro hádanky
  const [riddleAge, setRiddleAge] = useState('3-5');
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Funkce pro bezpečnou navigaci se změnou URL v prohlížeči
  const navigateTo = (path) => {
    window.history.pushState({}, '', '/' + path);
    window.dispatchEvent(new Event('popstate'));
  };

  // Načtení detailu podle slugu
  const loadItemBySlug = (slug) => {
    setLoading(true);
    fetch(`/api/get-library?slug=${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Nenalezeno');
        return res.json();
      })
      .then(data => {
        setSelectedItem(data);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        console.error(err);
        setSelectedItem(null);
        setLoading(false);
      });
  };

  // Načtení seznamu z Notion a obsluha vestavěného směrování (URL)
  useEffect(() => {
    fetch('/api/get-library')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
          setFilteredItems(data);
        }
        
        // Router: Zjistíme, co je napsané v URL adrese za lomítkem
        const handleRouting = () => {
          const path = window.location.pathname.replace(/^\/|\/$/g, '');
          
          if (path === 'hadanky') {
            setCurrentSection('riddles');
            setSelectedItem(null);
          } else if (path === '' || path === 'knihovna') {
            setCurrentSection('library');
            setSelectedItem(null);
          } else {
            // Pokud je v URL cokoliv jiného, bereme to jako slug pohádky
            setCurrentSection('library');
            loadItemBySlug(path);
          }
        };

        handleRouting();
        window.addEventListener('popstate', handleRouting);
        return () => window.removeEventListener('popstate', handleRouting);
      })
      .catch(err => {
        console.error("Chyba při inicializaci dat:", err);
        setLoading(false);
      });
  }, []);

  // Filtrování knihovny
  useEffect(() => {
    if (activeTab === 'vse') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === activeTab));
    }
  }, [activeTab, items]);

  // Logika hádanek
  const currentRiddles = RIDDLES_DATA[riddleAge];
  const currentRiddle = currentRiddles?.[currentRiddleIndex];

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
    setCurrentRiddleIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div class="min-h-screen text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Hlavička */}
      <header class="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div class="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('')}>
            <span class="text-3xl">🌙</span>
            <div>
              <h1 class="text-xl font-bold tracking-wide text-amber-400">Noční Knihovna</h1>
              <p class="text-xs text-slate-400">Klidné usínání plné příběhů</p>
            </div>
          </div>
          
          <nav class="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
            <button 
              onClick={() => navigateTo('')}
              class={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${currentSection === 'library' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BookOpen size={14} /> <span>Knihovna</span>
            </button>
            <button 
              onClick={() => navigateTo('hadanky')}
              class={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${currentSection === 'riddles' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <HelpCircle size={14} /> <span>Hádanky</span>
            </button>
          </nav>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-4 py-10">
        
        {/* SEKCE: KNIHOVNA */}
        {currentSection === 'library' && (
          selectedItem ? (
            /* DETAIL POHÁDKY VLASTNÍ STRÁNKA */
            <div class="max-w-4xl mx-auto">
              <button onClick={() => navigateTo('')} class="flex items-center space-x-2 text-slate-400 hover:text-amber-400 mb-8 transition group">
                <ArrowLeft size={18} class="transform group-hover:-translate-x-1 transition-transform" />
                <span>Zpět do knihovny</span>
              </button>

              <h2 class="text-4xl font-bold text-amber-400 mb-1">{selectedItem.title}</h2>
              {selectedItem.autor && <p class="text-slate-400 italic mb-3">Autor: {selectedItem.autor}</p>}
              <span class="inline-block bg-slate-800 text-amber-300 text-xs px-3 py-1 rounded-full font-medium mb-8">
                {selectedItem.type}
              </span>

              {/* YouTube přehrávač */}
              {selectedItem.youtubeId && (
                <div class="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mb-8 bg-slate-900">
                  <iframe src={`https://www.youtube.com/embed/${selectedItem.youtubeId}`} title={selectedItem.title} class="w-full h-full" allowFullScreen></iframe>
                </div>
              )}

              {/* Spotify přehrávač */}
              {selectedItem.spotifyId && (
                <div class="mb-10">
                  <iframe src={`https://open.spotify.com/embed/${selectedItem.spotifyId}`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="rounded-xl border border-slate-800"></iframe>
                </div>
              )}

              {/* Text pohádky z Notion těla */}
              <div class="prose prose-invert max-w-none bg-slate-900/40 p-6 md:p-10 rounded-2xl border border-slate-800/60 shadow-xl leading-relaxed text-slate-300" dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
              
              {selectedItem.heroHeroLink && (
                <div class="mt-8 text-center bg-gradient-to-r from-pink-900/20 to-rose-900/20 p-6 rounded-2xl border border-pink-500/20">
                  <p class="text-sm text-pink-200 mb-3 font-medium">Chceš poslouchat pohádky s předstihem a jako bonus získat písničky?</p>
                  <a href={selectedItem.heroHeroLink} target="_blank" rel="noreferrer" class="inline-flex items-center space-x-2 bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
                    <Sparkles size={16} /> <span>Pustit bonusy na HeroHero</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            /* SEZNAM VŠECH POHÁDEK */
            <div>
              <div class="text-center max-w-2xl mx-auto mb-12">
                <h2 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 mb-4">Místo pro klidné usínání</h2>
                <p class="text-slate-400">Pohádky čtené mým vlastním hlasem doplněné o ručně kreslené ilustrace na hnědém papíře.</p>
              </div>

              {/* Filtry se správnou češtinou */}
              <div class="flex justify-center flex-wrap gap-2 mb-10 border-b border-slate-900 pb-4">
                {['vse', 'Pohádka', 'Říkadlo', 'Písnička'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} class={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>

              {loading ? (
                <div class="text-center py-20 text-slate-400">Otevírám velkou pohádkovou knihu...</div>
              ) : (
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <div key={item.id} onClick={() => navigateTo(item.slug)} class="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all flex flex-col">
                      <div class="aspect-video w-full overflow-hidden relative bg-slate-950">
                        <img src={item.thumbnail} alt={item.title} class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                        <span class="absolute top-2 left-2 bg-slate-950/80 text-amber-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-800">{item.type}</span>
                      </div>
                      <div class="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 class="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                          {item.autor && <p class="text-xs text-slate-400 mt-1">{item.autor}</p>}
                        </div>
                        <div class="text-xs text-amber-400/80 font-medium mt-4">Přejít na pohádku →</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* SEKCE: HÁDANKY */}
        {currentSection === 'riddles' && (
          <div class="max-w-2xl mx-auto bg-slate-900/30 border border-slate-800 p-6 md:p-10 rounded-2xl shadow-xl">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-amber-400 flex items-center justify-center space-x-2">
                <span>✨</span> <span>Pohádkové hádanky</span>
              </h2>
              <p class="text-slate-400 text-sm mt-1">Procvičte hlavičky před spaním</p>
            </div>

            <div class="flex justify-center flex-wrap gap-2 mb-8">
              {[
                { id: '3-5', label: 'Mňauíci (3–5 let)' },
                { id: '6-9', label: 'Zkoumalové (6–9 let)' },
                { id: '10+', label: 'Chytrolíni (10+ let)' }
              ].map(cat => (
                <button key={cat.id} onClick={() => resetQuiz(cat.id)} class={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${riddleAge === cat.id ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
                  {cat.label}
                </button>
              ))}
            </div>

            {currentRiddle ? (!quizFinished ? (
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
                      <button key={idx} disabled={selectedAnswer !== null} onClick={() => handleAnswerClick(option)} class={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}>
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
                <button onClick={() => resetQuiz(riddleAge)} class="w-full bg-slate-900 border border-slate-800 text-slate-300 py-3 rounded-xl font-semibold transition">Hrát znovu 🔄</button>
              </div>
            )) : <div class="text-center text-slate-500">Zatím tu žádné hádanky pro tento věk nejsou.</div>}
          </div>
        )}

      </main>

      <footer class="border-t border-slate-900 mt-20 bg-slate-950/60 text-slate-500 py-8 text-center text-xs">
        <p>© {new Date().getFullYear()} Noční Knihovna. Všechna práva vyhrazena.</p>
        <p class="mt-1 text-slate-600">Čtené s láskou, kreslené ručně.</p>
      </footer>
    </div>
  );
}
