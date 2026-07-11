import React, { useState } from 'react';
import { Cloud, Moon, RotateCcw, Sparkles, ShoppingBag } from 'lucide-react';

export default function Ovecky() {
  const [sheepList, setSheepList] = useState([]);
  const [count, setCount] = useState(0);

  const handleAddSheep = () => {
    const id = Date.now();
    const newSheep = {
      id,
      x: Math.random() * 60 + 20, // Náhodná pozice na ploše
      y: Math.random() * 40 + 20,
      scale: Math.random() * 0.3 + 0.85
    };
    
    setSheepList(prev => [...prev, newSheep]);
    setCount(prev => prev + 1);

    // Po 4 sekundách ovečka plynule zmizí, aby nebylo nebe přeplněné
    setTimeout(() => {
      setSheepList(prev => prev.filter(s => s.id !== id));
    }, 4000);
  };

  const handleReset = () => {
    setSheepList([]);
    setCount(0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Večerní počítání oveček
        </h2>
        <p className="text-slate-400 text-sm">
          Tradiční rituál pro klidné usínání v digitální podobě. Klepnutím kamkoliv do noční oblohy pomůžete ovečce přeskočit spící měsíček.
        </p>
      </div>

      {/* Počítadlo */}
      <div className="flex justify-between items-center px-2 animate-fade-in">
        <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest bg-slate-900/40 border border-slate-800/60 px-4 py-2 rounded-xl">
          Skočilo oveček: <span className="text-white font-bold ml-1">{count}</span>
        </span>
        {count > 0 && (
          <button onClick={handleReset} className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer">
            <RotateCcw size={12} /> <span>Začít znovu</span>
          </button>
        )}
      </div>

      {/* Herní plocha */}
      <div 
        onClick={handleAddSheep}
        className="relative w-full aspect-[16/10] bg-[#020106] border border-slate-900 rounded-3xl overflow-hidden select-none shadow-2xl cursor-pointer group"
      >
        <div className="absolute inset-0 bg-radial-gradient from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Velký spící měsíc uprostřed */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-40 group-hover:opacity-50 transition-opacity duration-500">
          <span className="text-7xl md:text-8xl filter drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse">🌙</span>
          <span className="text-[9px] font-mono tracking-widest text-slate-600 mt-4 uppercase">Klepněte pro skok</span>
        </div>

        {/* Dynamicky se objevující ovečky */}
        {sheepList.map((sheep) => (
          <div
            key={sheep.id}
            style={{ 
              left: `${sheep.x}%`, 
              top: `${sheep.y}%`,
              transform: `translate(-50%, -50%) scale(${sheep.scale})`
            }}
            className="absolute flex flex-col items-center pointer-events-none animate-bounce-fade z-10"
          >
            <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">🐑</span>
            <div className="absolute -top-2 w-8 h-8 bg-white/10 rounded-full filter blur-md animate-ping" />
          </div>
        ))}

        {/* Dekorativní mráčky dole */}
        <div className="absolute -bottom-6 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent opacity-80 flex items-center justify-around text-slate-900/30">
          <Cloud size={60} strokeWidth={1} />
          <Cloud size={80} strokeWidth={1} className="hidden sm:block" />
          <Cloud size={50} strokeWidth={1} />
        </div>
      </div>

      {/* Spodní Affiliate Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group mt-12">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
          <div className="w-20 h-20 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-gradient-to-b from-slate-900 to-slate-950 text-amber-400/40">
            <Sparkles size={24} />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
              <Sparkles size={10} /> <span>Tip po počítání</span>
            </span>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
              Ovečky pomalu přeskákaly a víčka těžknou. Pro klidný přesun do postýlky skvěle fungují milí plyšoví usínáčci, kteří se stanou věrnými strážci krásných nočních snů Vašich dětí.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto self-center">
          <a href="https://www.alza.cz/hracky/pro-nejmenshi-plysaci/18851509.htm" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md">
            <ShoppingBag size={13} /> <span>Prohlédnout hračky</span>
          </a>
        </div>
      </div>
    </div>
  );
}
