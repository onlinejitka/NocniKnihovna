import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCcw, Maximize2, Minimize2, 
  CloudMoon, Star, Lightbulb, Feather, Flower2, Heart, Moon 
} from 'lucide-react';

// Ikony tvořící jednoduché bílé siluety
const ICONS = [CloudMoon, Star, Lightbulb, Feather, Flower2, Heart];

// Zpomalovací interval pro uklidňující tempo hry (v milisekundách)
const FLIP_DELAY = 1200; 

// Funkce pro zamíchání karet
const shuffleCards = () => {
  const paired = [...ICONS, ...ICONS].map((Icon, index) => ({
    id: index,
    IconComponent: Icon,
    isFlipped: false,
    isMatched: false,
  }));

  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }
  return paired;
};

export default function Pexeso() {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matches, setMatches] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef(null);

  // Inicializace hry
  const initGame = () => {
    setCards(shuffleCards());
    setFlippedIndexes([]);
    setMatches(0);
    setGameCompleted(false);
  };

  useEffect(() => {
    initGame();
    
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Vyhodnocení shody, když jsou otočeny dvě karty
  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const [firstIndex, secondIndex] = flippedIndexes;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.IconComponent === secondCard.IconComponent) {
        // Shoda - pomalu rozzáříme lampičky
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === firstIndex || i === secondIndex ? { ...card, isMatched: true } : card
          ));
          setMatches(prev => prev + 1);
          setFlippedIndexes([]);
        }, 300); // Rychlá reakce na shodu, animace zařídí plynulost
      } else {
        // Není shoda - necháme karty chvíli zobrazené, pak pomalu zhasnou
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === firstIndex || i === secondIndex ? { ...card, isFlipped: false } : card
          ));
          setFlippedIndexes([]);
        }, FLIP_DELAY);
      }
    }
  }, [flippedIndexes, cards]);

  // Vyhodnocení konce hry
  useEffect(() => {
    if (matches === ICONS.length && matches > 0) {
      setTimeout(() => {
        setGameCompleted(true);
      }, 1000);
    }
  }, [matches]);

  const handleCardClick = (index) => {
    // Pokud už jsou otočené dvě karty nebo na kartu už klikl/je spárovaná, ignorujeme
    if (flippedIndexes.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    // Otočíme kartu
    setCards(prev => prev.map((card, i) => i === index ? { ...card, isFlipped: true } : card));
    setFlippedIndexes(prev => [...prev, index]);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Popis hry */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Noční stínové pexeso
        </h2>
        <p className="text-slate-400 text-sm">
          Procvičte si s dětmi paměť bez zbytečného spěchu. Hledejte stejné snové symboly. Když najdete dvojici, stíny se plynule rozsvítí jako noční lampička.
        </p>
      </div>

      {/* Ovládací lišta */}
      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest bg-slate-900/40 border border-slate-800/60 px-3 py-1.5 rounded-xl">
          Nalezeno: {matches} / {ICONS.length}
        </span>
        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
        >
          {isFullscreen ? <Minimize2 size={14} className="text-amber-400" /> : <Maximize2 size={14} className="text-amber-400" />}
          <span>{isFullscreen ? 'Zmenšit okno' : 'Celá obrazovka'}</span>
        </button>
      </div>

      {/* PLOCHA HRY */}
      <div 
        ref={containerRef}
        className={`relative w-full bg-[#030206] border border-slate-900 overflow-hidden select-none transition-all duration-300 p-6 md:p-10 flex items-center justify-center ${
          isFullscreen ? 'rounded-none border-none h-screen' : 'rounded-3xl shadow-2xl min-h-[500px]'
        }`}
      >
        <div className="absolute inset-0 bg-radial-gradient from-indigo-950/10 via-transparent to-transparent pointer-events-none" />

        {/* Herní mřížka 4x3 */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl relative z-10">
          {cards.map((card, index) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`relative aspect-square rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-700 flex items-center justify-center overflow-hidden border ${
                  isRevealed
                    ? 'bg-slate-900/50 border-slate-800 shadow-inner'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700/80 shadow-md'
                }`}
              >
                {/* Zadní strana karty (zobrazuje se, když karta není otočená) */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                    isRevealed ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <Moon size={24} className="text-slate-700/50" />
                </div>

                {/* Přední strana karty (Ikona) */}
                <div 
                  className={`transition-all duration-[1500ms] ease-out flex items-center justify-center w-full h-full ${
                    card.isMatched 
                      ? 'opacity-100 scale-100' 
                      : card.isFlipped 
                      ? 'opacity-100 scale-90' 
                      : 'opacity-0 scale-50'
                  }`}
                >
                  {/* Zde se odehrává to kouzlo - při shodě ikona plynule začne svítit zlatě */}
                  <card.IconComponent 
                    size={48} 
                    strokeWidth={1.5} 
                    className={`transition-all duration-[2000ms] ${
                      card.isMatched 
                        ? 'text-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' 
                        : 'text-slate-300 drop-shadow-none'
                    }`}
                  />
                  
                  {/* Teplé pozadí pod kartou při shodě */}
                  <div className={`absolute inset-0 bg-amber-500/10 transition-opacity duration-[2000ms] pointer-events-none ${
                    card.isMatched ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* ZÁVĚREČNÁ OBRAZOVKA */}
        {gameCompleted && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
            <span className="text-5xl mb-3 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">🌙</span>
            <h3 className="text-2xl font-serif font-bold text-amber-300">
              Všechny stíny našly svůj pár
            </h3>
            <p className="text-slate-300 text-sm md:text-base max-w-sm mt-3 leading-relaxed px-4">
              Pexeso se rozsvítilo do klidné noci. Děkujeme za dnešní hraní a přejeme krásné sny plné odpočinku.
            </p>
            
            <button
              onClick={initGame}
              className="mt-6 inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md"
            >
              <RotateCcw size={14} /> <span>Schovat stíny a hrát znovu</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
