import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Maximize2, Minimize2, Lock, CheckCircle, CloudMoon, Star, Lightbulb, Feather, Flower2, Heart, Moon } from 'lucide-react';

const ICONS = [CloudMoon, Star, Lightbulb, Feather, Flower2, Heart];
const FLIP_DELAY = 1200; 

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
  const [isUserVip, setIsUserVip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState(localStorage.getItem('sl_passcode') || '');
  const [inputCode, setInputCode] = useState(passcode);
  const [codeSaved, setCodeSaved] = useState(false);

  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matches, setMatches] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/get-library?passcode=${passcode}`)
      .then(res => res.json())
      .then(data => {
        if (data) setIsUserVip(data.isUserVip);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [passcode]);

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

  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const [firstIndex, secondIndex] = flippedIndexes;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.IconComponent === secondCard.IconComponent) {
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => i === firstIndex || i === secondIndex ? { ...card, isMatched: true } : card));
          setMatches(prev => prev + 1);
          setFlippedIndexes([]);
        }, 300); 
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => i === firstIndex || i === secondIndex ? { ...card, isFlipped: false } : card));
          setFlippedIndexes([]);
        }, FLIP_DELAY);
      }
    }
  }, [flippedIndexes, cards]);

  useEffect(() => {
    if (matches === ICONS.length && matches > 0) {
      setTimeout(() => setGameCompleted(true), 1000);
    }
  }, [matches]);

  const openStripePopup = (e) => {
    if (e) e.preventDefault();
    const url = "https://buy.stripe.com/8x2fZh8CZ2H2eD73aQ9IQ0q";
    const width = 500;
    const height = 710;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(url, 'StripePremiumCheckout', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`);
  };

  const handleSaveCode = (e) => {
    e.preventDefault();
    localStorage.setItem('sl_passcode', inputCode.trim());
    setPasscode(inputCode.trim());
    setCodeSaved(true);
    setTimeout(() => setCodeSaved(false), 3000);
  };

  const handleCardClick = (index) => {
    if (!isUserVip) {
      openStripePopup();
      return;
    }
    if (flippedIndexes.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
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
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Noční stínové pexeso
        </h2>
        <p className="text-slate-400 text-sm">
          Procvičte si s dětmi paměť bez zbytečného spěchu. Hledejte stejné snové symboly. Když najdete dvojici, stíny se plynule rozsvítí jako noční lampička.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium tracking-wide">Připravuji hrací karty...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-2 animate-fade-in">
            <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest bg-slate-900/40 border border-slate-800/60 px-3 py-1.5 rounded-xl">
              Nalezeno: {matches} / {ICONS.length}
            </span>
            <button onClick={isUserVip ? toggleFullscreen : openStripePopup} className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md">
              {isFullscreen ? <Minimize2 size={14} className="text-amber-400" /> : <Maximize2 size={14} className="text-amber-400" />}
              <span>{isFullscreen ? 'Zmenšit okno' : 'Celá obrazovka'}</span>
            </button>
          </div>

          <div ref={containerRef} className={`relative w-full bg-[#030206] border border-slate-900 overflow-hidden select-none transition-all duration-300 p-6 md:p-10 flex items-center justify-center animate-fade-in ${isFullscreen ? 'rounded-none border-none h-screen' : 'rounded-3xl shadow-2xl min-h-[500px]'}`}>
            <div className="absolute inset-0 bg-radial-gradient from-indigo-950/10 via-transparent to-transparent pointer-events-none" />

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl relative z-10">
              {cards.map((card, index) => {
                const isRevealed = card.isFlipped || card.isMatched;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`relative aspect-square rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-700 flex items-center justify-center overflow-hidden border ${isRevealed ? 'bg-slate-900/50 border-slate-800 shadow-inner' : 'bg-slate-800 border-slate-700 hover:bg-slate-700/80 shadow-md'}`}
                  >
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}>
                      <Moon size={24} className="text-slate-700/50" />
                    </div>
                    <div className={`transition-all duration-[1500ms] ease-out flex items-center justify-center w-full h-full ${card.isMatched ? 'opacity-100 scale-100' : card.isFlipped ? 'opacity-100 scale-90' : 'opacity-0 scale-50'}`}>
                      <card.IconComponent size={48} strokeWidth={1.5} className={`transition-all duration-[2000ms] ${card.isMatched ? 'text-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'text-slate-300 drop-shadow-none'}`} />
                      <div className={`absolute inset-0 bg-amber-500/10 transition-opacity duration-[2000ms] pointer-events-none ${card.isMatched ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* VIZUÁLNÍ ZÁMEK PŘES CELOU HRU POKUD NENÍ VIP */}
            {!isUserVip && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-30 transition-all duration-500">
                <div onClick={openStripePopup} className="w-16 h-16 bg-slate-900/90 rounded-full flex items-center justify-center shadow-2xl border border-slate-700 cursor-pointer hover:scale-110 transition-transform">
                  <Lock className="text-amber-500/90 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={28} />
                </div>
              </div>
            )}

            {gameCompleted && isUserVip && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
                <span className="text-5xl mb-3 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">🌙</span>
                <h3 className="text-2xl font-serif font-bold text-amber-300">Všechny stíny našly svůj pár</h3>
                <p className="text-slate-300 text-sm md:text-base max-w-sm mt-3 leading-relaxed px-4">Pexeso se rozsvítilo do klidné noci. Děkujeme za dnešní hraní a přejeme krásné sny plné odpočinku.</p>
                <button onClick={initGame} className="mt-6 inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md">
                  <RotateCcw size={14} /> <span>Schovat stíny a hrát znovu</span>
                </button>
              </div>
            )}
          </div>

          {/* PRODEJNÍ BOX */}
          {!isUserVip && (
            <div className="max-w-xl mx-auto space-y-6 pt-6 animate-fade-in">
              <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl text-center space-y-6 shadow-xl">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-amber-300">Prémiová uklidňující hra</h3>
                  <p className="text-slate-400 text-sm leading-relaxed px-2">
                    Tato snová hra je exkluzivní součástí Premium balíčku Noční Knihovny. Aktivací členství získáte okamžitý přístup k oběma hrám navíc (Pexeso a Souhvězdí), všem rozšířeným omalovánkám, nahrávkám a AI generátoru.
                  </p>
                </div>
                <button onClick={openStripePopup} className="w-full md:w-auto inline-block text-center bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wide transition shadow-lg hover:shadow-orange-500/5 hover:opacity-95 cursor-pointer">
                  Aktivovat Premium za 75 Kč ➔
                </button>
              </div>

              <form onSubmit={handleSaveCode} className="bg-slate-900/20 border border-slate-800/60 p-4 rounded-xl space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  🔑 Již máte svůj Premium přístupový kód?
                </label>
                <div className="flex space-x-2">
                  <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Vložte Váš kód (např. sl-jiri-8x3a)..." className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500" />
                  <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-lg transition shrink-0 cursor-pointer">
                    Uložit kód
                  </button>
                </div>
                {codeSaved && (
                  <p className="text-emerald-400 text-[11px] flex items-center space-x-1 animate-pulse">
                    <CheckCircle size={12} /> <span>Kód byl úspěšně uložen! Ověřuji přístup...</span>
                  </p>
                )}
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
