import React, { useState, useEffect, useRef } from 'react';
import { Sparkle, RotateCcw, HelpCircle, Lightbulb } from 'lucide-react';

// Nastavení hry: počet světlušek a pozice lucerny (v procentech herního okna)
const TOTAL_FIREFLIES = 8;
const LANTERN_X = 50; // střed horizontálně
const LANTERN_Y = 75; // spodní část vertikálně

export default function Hra() {
  const [fireflies, setFireflies] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const requestRef = useRef();

  // Inicializace světlušek s náhodnými pozicemi a rychlostmi
  const initGame = () => {
    const initial = Array.from({ length: TOTAL_FIREFLIES }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // pozice v % (10 až 90)
      y: Math.random() * 50 + 10, // pozice v % (10 až 60)
      vx: (Math.random() - 0.5) * 0.3, // líná rychlost X
      vy: (Math.random() - 0.5) * 0.3, // líná rychlost Y
      isCollected: false,
      isInside: false,
      size: Math.random() * 6 + 8 // náhodná velikost světýlka
    }));
    setFireflies(initial);
    setGameCompleted(false);
  };

  useEffect(() => {
    initGame();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Hlavní herní smyčka běžící přes requestAnimationFrame pro maximální plynulost
  const updateGame = () => {
    setFireflies((prevFireflies) => {
      let allInside = true;
      
      const updated = prevFireflies.map((f) => {
        if (f.isInside) return f;
        allInside = false;

        // A: Světluška je chycená -> letí plynule přímo do lucerny
        if (f.isCollected) {
          const dx = LANTERN_X - f.x;
          const dy = LANTERN_Y - f.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Pokud dorazila dostatečně blízko do lucerny, schováme ji dovnitř
          if (distance < 2) {
            return { ...f, isInside: true, x: LANTERN_X, y: LANTERN_Y };
          }

          // Plynulý přesun směrem k lucerně
          return {
            ...f,
            x: f.x + dx * 0.08,
            y: f.y + dy * 0.08
          };
        }

        // B: Světluška volně létá -> líný pohyb s odrazy od stěn herního okna
        let nextX = f.x + f.vx;
        let nextY = f.y + f.vy;
        let nextVx = f.vx;
        let nextVy = f.vy;

        if (nextX < 4 || nextX > 96) nextVx = -nextVx;
        if (nextY < 4 || nextY > 65) nextVy = -nextVy;

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

  // Kliknutí / Klepnutí na světlušku
  const handleFireflyClick = (id) => {
    setFireflies((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isCollected: true } : f))
    );
  };

  const insideCount = fireflies.filter((f) => f.isInside).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Textový úvod s vykáním */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Uklidňující večerní hra
        </h2>
        <p className="text-slate-400 text-sm">
          Pomozte dětem zklidnit očka před spaním. Pomalým klepnutím posílejte blikající světlušky dolů do lucerny. Hra nemá žádný časový limit ani skóre.
        </p>
      </div>

      {/* Hlavní herní plocha simulující noční oblohu */}
      <div className="relative w-full aspect-[16/10] bg-[#05040a] border border-slate-900 rounded-3xl overflow-hidden shadow-2xl select-none group">
        
        {/* Pozadí: Mlhovina a hvězdy */}
        <div className="absolute inset-0 bg-radial-gradient from-purple-950/10 via-transparent to-transparent pointer-events-none" />
        
        {/* VOLNĚ LÉTAJÍCÍ SVĚTLUŠKY */}
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
                width: `${f.size}px`,
                height: `${f.size}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute rounded-full bg-amber-300 transition-shadow duration-300 cursor-pointer ${
                f.isCollected 
                  ? 'shadow-[0_0_25px_rgba(251,191,36,1)] scale-110' 
                  : 'shadow-[0_0_12px_rgba(251,191,36,0.7)] hover:shadow-[0_0_20px_rgba(251,191,36,1)] animate-pulse'
              }`}
            />
          );
        })}

        {/* GRAFICKÁ LUCERNA (Umístěná dole uprostřed) */}
        <div 
          style={{ left: `${LANTERN_X}%`, top: `${LANTERN_Y}%`, transform: 'translate(-50%, -50%)' }}
          className="absolute w-20 h-28 flex flex-col items-center justify-end"
        >
          {/* Držadlo lucerny */}
          <div className="w-8 h-6 border-2 border-slate-700 rounded-t-full -mb-1" />
          {/* Stříška lucerny */}
          <div className="w-16 h-3 bg-slate-800 rounded-t-md border border-slate-700" />
          
          {/* Skleněné tělo lucerny s dynamickým svitem podle počtu světlušek */}
          <div className="w-14 h-20 bg-slate-900/80 border-2 border-slate-700 rounded-b-xl relative flex items-center justify-center overflow-hidden">
            {/* Vnitřní záře zvětšující se s každou chycenou světluškou */}
            <div 
              style={{ 
                opacity: insideCount / TOTAL_FIREFLIES,
                transform: `scale(${1 + (insideCount * 0.15)})`
              }}
              className="absolute w-10 h-10 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full filter blur-md transition-all duration-500"
            />
            {/* Ikona žárovky/plamínku uvnitř */}
            <Lightbulb 
              size={24} 
              className={`relative z-10 transition-colors duration-500 ${
                insideCount > 0 ? 'text-amber-200' : 'text-slate-700'
              }`} 
            />
          </div>

          {/* Počítadlo chycených světlušek pod lucernou */}
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 select-none">
            {insideCount} / {TOTAL_FIREFLIES}
          </span>
        </div>

        {/* OBRAZOVKA S PŘÁNÍM PO ÚSPĚŠNÉM DOKONČENÍ */}
        {gameCompleted && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
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
  );
}
