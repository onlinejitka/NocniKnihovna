import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Lightbulb, Maximize2, Minimize2 } from 'lucide-react';

const TOTAL_FIREFLIES = 8;
const LANTERN_X = 50; 
const LANTERN_Y = 75; 

export default function Hra() {
  const [fireflies, setFireflies] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const gameContainerRef = useRef(null);
  const requestRef = useRef();
  const [audioDuration, setAudioDuration] = useState('--:--');

  // Inicializace světlušek s upravenou, mnohem línější rychlostí
  const initGame = () => {
    const initial = Array.from({ length: TOTAL_FIREFLIES }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, 
      y: Math.random() * 45 + 10, 
      vx: (Math.random() - 0.5) * 0.12, // Výrazně zpomaleno pro uklidňující drift
      vy: (Math.random() - 0.5) * 0.12, // Výrazně zpomaleno pro uklidňující drift
      isCollected: false,
      isInside: false,
      size: Math.random() * 5 + 8 // velikost viditelného jádra
    }));
    setFireflies(initial);
    setGameCompleted(false);
  };

  useEffect(() => {
    initGame();
    
    // Sledování změn stavu vestavěného fullscreenu (např. při zmáčknutí klávesy Esc)
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      cancelAnimationFrame(requestRef.current);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Hlavní herní smyčka
  const updateGame = () => {
    setFireflies((prevFireflies) => {
      let allInside = true;
      
      const updated = prevFireflies.map((f) => {
        if (f.isInside) return f;
        allInside = false;

        if (f.isCollected) {
          const dx = LANTERN_X - f.x;
          const dy = LANTERN_Y - f.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 2.5) {
            return { ...f, isInside: true, x: LANTERN_X, y: LANTERN_Y };
          }

          return {
            ...f,
            x: f.x + dx * 0.06, // Plynulejší vtahování do lucerny
            y: f.y + dy * 0.06
          };
        }

        let nextX = f.x + f.vx;
        let nextY = f.y + f.vy;
        let nextVx = f.vx;
        let nextVy = f.vy;

        if (nextX < 4 || nextX > 96) nextVx = -nextVx;
        if (nextY < 4 || nextY > 62) nextVy = -nextVy;

        return {
          ...f,
          x: nextX,
          y: nextY,
          vx: nextVx,
          vy: nextVy
        };
      });

      if (allInside && prevFireflies.length > 0 && !gameCompleted) {
        setGameCompleted(true);
      }

      return updated;
    });

    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameCompleted]);

  const handleFireflyClick = (id) => {
    setFireflies((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isCollected: true } : f))
    );
  };

  // Funkce pro zapnutí a vypnutí režimu celé obrazovky (Fullscreen API)
  const toggleFullscreen = () => {
    if (!gameContainerRef.current) return;

    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Fullscreen selhal:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false));
    }
  };

  const insideCount = fireflies.filter((f) => f.isInside).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Textový úvod s vykáním */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Uklidňující večerní hra
        </h2>
        <p className="text-slate-400 text-sm">
          Pomozte dětem zklidnit očka před spaním. Pomalým klepnutím posílejte blikající světlušky dolů do lucerny. Hra nemá žádný časový limit ani skóre.
        </p>
      </div>

      {/* TLAČÍTKO PRO CELOU OBRAZOVKU PŘED OKNEM HRY */}
      <div className="flex justify-end px-2">
        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
        >
          {isFullscreen ? (
            <>
              <Minimize2 size={14} className="text-amber-400" />
              <span>Zmenšit okno</span>
            </>
          ) : (
            <>
              <Maximize2 size={14} className="text-amber-400" />
              <span>Zobrazit na celou obrazovku</span>
            </>
          )}
        </button>
      </div>

      {/* RECONER PRO CELÉ OKNO HRY (Kontejner, který se zvětší na Fullscreen) */}
      <div 
        ref={gameContainerRef}
        className={`relative w-full aspect-[16/10] bg-[#030206] border border-slate-900 overflow-hidden select-none group transition-all duration-300 ${
          isFullscreen ? 'rounded-none border-none' : 'rounded-3xl shadow-2xl'
        }`}
      >
        {/* Pozadí: Jemná snová mlhovina */}
        <div className="absolute inset-0 bg-radial-gradient from-purple-950/20 via-transparent to-transparent pointer-events-none" />
        
        {/* SVĚTLUŠKY S VELKÝM NEVIDITELNÝM HITBOXEM */}
        {fireflies.map((f) => {
          if (f.isInside) return null;
          return (
            <button
              key={f.id}
              onClick={() => handleFireflyClick(f.id)}
              disabled={f.isCollected}
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: '44px',  // OPRAVENO: Velký komfortní hitbox pro prst i myš
                height: '44px', // OPRAVENO: Velký komfortní hitbox pro prst i myš
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute flex items-center justify-center bg-transparent border-none outline-none cursor-pointer z-10 p-0"
            >
              {/* Viditelné svítící jádro světlušky s posíleným vícevrstvým jasem pro mobily */}
              <div
                style={{
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                }}
                className={`rounded-full bg-amber-200 transition-all duration-300 ${
                  f.isCollected 
                    ? 'shadow-[0_0_20px_#fbbf24,0_0_40px_#fbbf24] bg-white scale-125' 
                    : 'shadow-[0_0_10px_#fbbf24,0_0_25px_rgba(251,191,36,0.8)] animate-pulse'
                }`}
              />
            </button>
          );
        })}

        {/* GRAFICKÁ LUCERNA */}
        <div 
          style={{ left: `${LANTERN_X}%`, top: `${LANTERN_Y}%`, transform: 'translate(-50%, -50%)' }}
          className="absolute w-20 h-28 flex flex-col items-center justify-end"
        >
          <div className="w-8 h-6 border-2 border-slate-700 rounded-t-full -mb-1" />
          <div className="w-16 h-3 bg-slate-800 rounded-t-md border border-slate-700" />
          
          <div className="w-14 h-20 bg-slate-900/90 border-2 border-slate-700 rounded-b-xl relative flex items-center justify-center overflow-hidden">
            <div 
              style={{ 
                opacity: insideCount / TOTAL_FIREFLIES,
                transform: `scale(${1 + (insideCount * 0.2)})`
              }}
              className="absolute w-10 h-10 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full filter blur-md transition-all duration-500 shadow-[0_0_30px_rgba(251,191,36,0.6)]"
            />
            <Lightbulb 
              size={24} 
              className={`relative z-10 transition-colors duration-500 ${
                insideCount > 0 ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,1)]' : 'text-slate-700'
              }`} 
            />
          </div>

          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 select-none">
            {insideCount} / {TOTAL_FIREFLIES}
          </span>
        </div>

        {/* OBRAZOVKA S PŘÁNÍM PO ÚSPĚŠNÉM DOKONČENÍ */}
        {gameCompleted && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
            <span className="text-5xl mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-bounce">🌙</span>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-300 max-w-md leading-snug">
              Lucerna jasně září...
            </h3>
            <p className="text-slate-300 text-sm md:text-base max-w-md mt-2 leading-relaxed px-4">
              Všechny světlušky jsou bezpečně v pelíšku a lucerna Vám bude celou noc hlídat klidné sny. Nyní je čas zavřít očička i u Vás doma.
            </p>
            <p className="text-amber-400/80 text-xs italic mt-2 font-medium">
              Přejeme Vám kouzelnou dobrou noc.
            </p>
            
            <button
              onClick={initGame}
              className="mt-6 inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              <RotateCcw size={12} /> <span>Rozsvítit znovu</span>
            </button>
          </div>
        )}
      </div>
    </div>



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
  );
}
