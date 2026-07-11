import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Maximize2, Minimize2, Sparkles, Lock, CheckCircle } from 'lucide-react';

const CONSTELLATIONS_DATA = [
  {
    name: "Kouzelná hvězdička",
    emoji: "⭐",
    description: "První hvězda, která večer zazáří na obloze.",
    stars: [
      { x: 50, y: 18 }, { x: 68, y: 75 }, { x: 22, y: 40 },
      { x: 78, y: 40 }, { x: 32, y: 75 }
    ],
    closed: true
  },
  {
    name: "Spící měsíček",
    emoji: "🌙",
    description: "Nebeská kolébka pro všechny unavené oči.",
    stars: [
      { x: 50, y: 20 }, { x: 66, y: 32 }, { x: 72, y: 52 },
      { x: 62, y: 72 }, { x: 44, y: 78 }, { x: 46, y: 56 }, { x: 48, y: 36 }
    ],
    closed: true
  },
  {
    name: "Vesmírná lodička",
    emoji: "⛵",
    description: "Pluje tichým vesmírem po Mléčné dráze.",
    stars: [
      { x: 50, y: 25 }, { x: 72, y: 55 }, { x: 50, y: 60 },
      { x: 78, y: 60 }, { x: 68, y: 76 }, { x: 32, y: 76 }, { x: 22, y: 60 }
    ],
    closed: true
  },
  {
    name: "Pohádkový domeček",
    emoji: "🏠",
    description: "Místo, kde jsou všichni v bezpečí a teple.",
    stars: [
      { x: 30, y: 75 }, { x: 30, y: 45 }, { x: 50, y: 24 },
      { x: 70, y: 45 }, { x: 70, y: 75 }
    ],
    closed: true
  }
];

const PENTATONIC_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function Souhvezdi() {
  // STAVY PRO PREMIUM ZÁMEK
  const [isUserVip, setIsUserVip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState(localStorage.getItem('sl_passcode') || '');
  const [inputCode, setInputCode] = useState(passcode);
  const [codeSaved, setCodeSaved] = useState(false);

  // STAVY PRO HRU
  const [order, setOrder] = useState(() => shuffleArray(CONSTELLATIONS_DATA));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [connected, setConnected] = useState([]); 
  const [shapeRevealed, setShapeRevealed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef(null);
  const activeConstellation = order[currentIdx];

  const requiredClicks = activeConstellation.closed 
    ? activeConstellation.stars.length + 1 
    : activeConstellation.stars.length;

  // Kontrola přístupu k Premium obsahu
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

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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

  const playCelestialChime = (step) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const freq = PENTATONIC_SCALE[step % PENTATONIC_SCALE.length];
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.4);
    } catch (err) {
      console.warn("Audio error:", err);
    }
  };

  const handleStarClick = (index) => {
    const isComplete = connected.length === requiredClicks;
    const isNextTarget = !isComplete && (
      (index === connected.length && index < activeConstellation.stars.length) ||
      (activeConstellation.closed && connected.length === activeConstellation.stars.length && index === 0)
    );

    if (!isNextTarget) return;

    playCelestialChime(connected.length);
    const newConnected = [...connected, index];
    setConnected(newConnected);

    if (newConnected.length === requiredClicks) {
      setTimeout(() => setShapeRevealed(true), 400);
    }
  };

  const nextLevel = () => {
    setConnected([]);
    setShapeRevealed(false);
    if (currentIdx + 1 >= order.length) {
      setOrder(shuffleArray(CONSTELLATIONS_DATA));
      setCurrentIdx(0);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const resetLevel = () => {
    setConnected([]);
    setShapeRevealed(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  if (!activeConstellation) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Spojování hvězdné oblohy
        </h2>
        <p className="text-slate-400 text-sm">
          Soustřeďte se s dětmi na zářící body. Postupným klepáním na zvýrazněné hvězdy propojíte noční nebe zlatou nití a odhalíte skrytý pohádkový motiv.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium tracking-wide">Připravuji nebeskou klenbu...</p>
        </div>
      ) : !isUserVip ? (
        /* PREMIUM ZÁMEK PRO SOUHVĚZDÍ */
        <div className="max-w-xl mx-auto space-y-6 mt-8 animate-fade-in">
          <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl text-center space-y-6 shadow-xl">
            <div className="mx-auto w-16 h-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center shadow-inner">
              <Lock className="text-amber-500/60" size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-amber-300">Prémiová uklidňující hra</h3>
              <p className="text-slate-400 text-sm leading-relaxed px-2">
                Tato snová hra je exkluzivní součástí Premium balíčku Noční Knihovny. Aktivací členství získáte okamžitý přístup k oběma hrám navíc (Souhvězdí a Pexeso), všem rozšířeným omalovánkám, nahrávkám a AI generátoru.
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
      ) : (
        /* VLASTNÍ HRA PO ODEMČENÍ */
        <>
          <div className="flex justify-between items-center px-2 animate-fade-in">
            <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest bg-slate-900/40 border border-slate-800/60 px-3 py-1.5 rounded-xl">
              Souhvězdí: {currentIdx + 1} / {order.length}
            </span>
            <button onClick={toggleFullscreen} className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md">
              {isFullscreen ? <Minimize2 size={14} className="text-amber-400" /> : <Maximize2 size={14} className="text-amber-400" />}
              <span>{isFullscreen ? 'Zmenšit okno' : 'Celá obrazovka'}</span>
            </button>
          </div>

          <div ref={containerRef} className={`relative w-full aspect-[16/10] bg-[#020105] border border-slate-900 overflow-hidden select-none transition-all duration-300 animate-fade-in ${isFullscreen ? 'rounded-none border-none' : 'rounded-3xl shadow-2xl'}`}>
            <div className="absolute inset-0 bg-radial-gradient from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {connected.map((starIdx, i) => {
                if (i === 0) return null;
                const startStar = activeConstellation.stars[connected[i - 1]];
                const endStar = activeConstellation.stars[starIdx];
                return (
                  <line key={i} x1={startStar.x} y1={startStar.y} x2={endStar.x} y2={endStar.y} stroke="#fbbf24" strokeWidth="0.4" className="animate-fade-in drop-shadow-[0_0_6px_#fbbf24]" />
                );
              })}
            </svg>

            {activeConstellation.stars.map((star, index) => {
              const isNextTarget = connected.length < requiredClicks && ((index === connected.length && index < activeConstellation.stars.length) || (activeConstellation.closed && connected.length === activeConstellation.stars.length && index === 0));
              const isConnected = connected.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => handleStarClick(index)}
                  disabled={!isNextTarget}
                  style={{ left: `${star.x}%`, top: `${star.y}%`, width: '44px', height: '44px', transform: 'translate(-50%, -50%)' }}
                  className="absolute flex items-center justify-center bg-transparent border-none outline-none z-10 p-0 cursor-pointer"
                >
                  {isNextTarget && <div className="absolute w-6 h-6 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />}
                  <div className={`rounded-full transition-all duration-500 ${isNextTarget ? 'w-3 h-3 bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-pulse scale-110 border border-white/20' : isConnected ? 'w-2.5 h-2.5 bg-white shadow-[0_0_15px_#fff,0_0_25px_#fbbf24]' : 'w-2 h-2 bg-slate-700 shadow-none'}`} />
                </button>
              );
            })}

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none select-none">
              <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
                {connected.length === activeConstellation.stars.length ? 'Vraťte se na první hvězdu' : 'Hledejte další hvězdu'}
              </p>
              <h4 className="text-sm font-medium text-slate-400">{activeConstellation.name}</h4>
            </div>

            {shapeRevealed && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
                <span className="text-5xl mb-3 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{activeConstellation.emoji}</span>
                <h3 className="text-2xl font-serif font-bold text-amber-300">Souhvězdí odhaleno!</h3>
                <p className="text-amber-100/90 text-sm font-medium italic mt-1">„{activeConstellation.name}“</p>
                <p className="text-slate-400 text-xs md:text-sm max-w-sm mt-3 leading-relaxed px-4">
                  {activeConstellation.description} Obloha se krásně rozsvítila a doprovodí Vás do snové říše.
                </p>
                
                <div className="mt-6 flex items-center space-x-3">
                  <button onClick={resetLevel} className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                    <RotateCcw size={12} /> <span>Znovu</span>
                  </button>
                  <button onClick={nextLevel} className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl uppercase tracking-wide transition cursor-pointer shadow-md">
                    <Sparkles size={12} /> <span>Další souhvězdí</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
