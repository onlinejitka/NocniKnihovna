import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Maximize2, Minimize2, Sparkles } from 'lucide-react';

const CONSTELLATIONS = [
  {
    name: "Kouzelná hvězdička",
    emoji: "⭐",
    description: "První hvězda, která večer zazáří na obloze.",
    stars: [
      { x: 50, y: 18 },
      { x: 68, y: 75 },
      { x: 22, y: 40 },
      { x: 78, y: 40 },
      { x: 32, y: 75 }
    ],
    closed: true
  },
  {
    name: "Spící měsíček",
    emoji: "🌙",
    description: "Nebeská kolébka pro všechny unavené oči.",
    stars: [
      { x: 50, y: 20 },
      { x: 66, y: 32 },
      { x: 72, y: 52 },
      { x: 62, y: 72 },
      { x: 44, y: 78 },
      { x: 46, y: 56 },
      { x: 48, y: 36 }
    ],
    closed: true
  },
  {
    name: "Vesmírná lodička",
    emoji: "⛵",
    description: "Pluje tichým vesmírem po Mléčné dráze.",
    stars: [
      { x: 50, y: 25 },
      { x: 72, y: 55 },
      { x: 50, y: 60 },
      { x: 78, y: 60 },
      { x: 68, y: 76 },
      { x: 32, y: 76 },
      { x: 22, y: 60 }
    ],
    closed: true
  },
  {
    name: "Pohádkový domeček",
    emoji: "🏠",
    description: "Místo, kde jsou všichni v bezpečí a teple.",
    stars: [
      { x: 30, y: 75 },
      { x: 30, y: 45 },
      { x: 50, y: 24 },
      { x: 70, y: 45 },
      { x: 70, y: 75 }
    ],
    closed: true
  }
];

const PENTATONIC_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

export default function Souhvezdi() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [connected, setConnected] = useState([]); 
  const [shapeRevealed, setShapeRevealed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef(null);
  const activeConstellation = CONSTELLATIONS[currentIdx];

  // Dynamický výpočet potřebného počtu kliknutí (u uzavřených obrazců musí hráč kliknout o jednou víc)
  const requiredClicks = activeConstellation.closed 
    ? activeConstellation.stars.length + 1 
    : activeConstellation.stars.length;

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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
    // Definujeme, na kterou hvězdu se smí kliknout
    const isComplete = connected.length === requiredClicks;
    const isNextTarget = !isComplete && (
      (index === connected.length && index < activeConstellation.stars.length) || // Standardní postup vpřed
      (activeConstellation.closed && connected.length === activeConstellation.stars.length && index === 0) // Návrat na první hvězdu
    );

    if (!isNextTarget) return;

    playCelestialChime(connected.length);
    const newConnected = [...connected, index];
    setConnected(newConnected);

    // Jakmile je naklikáno dostatek hvězd, hru vyhodnotíme
    if (newConnected.length === requiredClicks) {
      setTimeout(() => {
        setShapeRevealed(true);
      }, 400);
    }
  };

  const nextLevel = () => {
    setConnected([]);
    setShapeRevealed(false);
    setCurrentIdx((prev) => (prev + 1) % CONSTELLATIONS.length);
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

      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest bg-slate-900/40 border border-slate-800/60 px-3 py-1.5 rounded-xl">
          Souhvězdí: {currentIdx + 1} / {CONSTELLATIONS.length}
        </span>
        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
        >
          {isFullscreen ? <Minimize2 size={14} className="text-amber-400" /> : <Maximize2 size={14} className="text-amber-400" />}
          <span>{isFullscreen ? 'Zmenšit okno' : 'Celá obrazovka'}</span>
        </button>
      </div>

      <div 
        ref={containerRef}
        className={`relative w-full aspect-[16/10] bg-[#020105] border border-slate-900 overflow-hidden select-none transition-all duration-300 ${
          isFullscreen ? 'rounded-none border-none' : 'rounded-3xl shadow-2xl'
        }`}
      >
        <div className="absolute inset-0 bg-radial-gradient from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {connected.map((starIdx, i) => {
            if (i === 0) return null;
            const startStar = activeConstellation.stars[connected[i - 1]];
            const endStar = activeConstellation.stars[starIdx];
            return (
              <line 
                key={i}
                x1={startStar.x} y1={startStar.y}
                x2={endStar.x} y2={endStar.y}
                stroke="#fbbf24"
                strokeWidth="0.4"
                className="animate-fade-in drop-shadow-[0_0_6px_#fbbf24]"
              />
            );
          })}
        </svg>

        {activeConstellation.stars.map((star, index) => {
          // Zjišťujeme, zda je tato hvězda dalším logickým cílem (včetně návratu na první hvězdu)
          const isNextTarget = connected.length < requiredClicks && (
            (index === connected.length && index < activeConstellation.stars.length) ||
            (activeConstellation.closed && connected.length === activeConstellation.stars.length && index === 0)
          );

          // Hvězda svítí jasně, pokud už jí prošla čára (její index je v poli "connected")
          const isConnected = connected.includes(index);

          return (
            <button
              key={index}
              onClick={() => handleStarClick(index)}
              disabled={!isNextTarget}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: '44px',
                height: '44px',
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute flex items-center justify-center bg-transparent border-none outline-none z-10 p-0 cursor-pointer"
            >
              {isNextTarget && (
                <div className="absolute w-6 h-6 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />
              )}
              
              <div 
                className={`rounded-full transition-all duration-500 ${
                  isNextTarget
                    ? 'w-3 h-3 bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-pulse scale-110 border border-white/20'
                    : isConnected
                    ? 'w-2.5 h-2.5 bg-white shadow-[0_0_15px_#fff,0_0_25px_#fbbf24]' 
                    : 'w-2 h-2 bg-slate-700 shadow-none'
                }`}
              />
            </button>
          );
        })}

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none select-none">
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
            {connected.length === activeConstellation.stars.length 
              ? 'Vraťte se na první hvězdu' 
              : 'Hledejte další hvězdu'}
          </p>
          <h4 className="text-sm font-medium text-slate-400">{activeConstellation.name}</h4>
        </div>

        {shapeRevealed && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
            <span className="text-5xl mb-3 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{activeConstellation.emoji}</span>
            <h3 className="text-2xl font-serif font-bold text-amber-300">
              Souhvězdí odhaleno!
            </h3>
            <p className="text-amber-100/90 text-sm font-medium italic mt-1">
              „{activeConstellation.name}“
            </p>
            <p className="text-slate-400 text-xs md:text-sm max-w-sm mt-3 leading-relaxed px-4">
              {activeConstellation.description} Obloha se krásně rozsvítila a doprovodí Vás do snové říše.
            </p>
            
            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={resetLevel}
                className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <RotateCcw size={12} /> <span>Znovu</span>
              </button>
              <button
                onClick={nextLevel}
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl uppercase tracking-wide transition cursor-pointer shadow-md"
              >
                <Sparkles size={12} /> <span>Další souhvězdí</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
