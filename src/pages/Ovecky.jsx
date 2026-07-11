import React, { useState } from 'react';
import { Cloud, RotateCcw, Sparkles, ShoppingBag } from 'lucide-react';

export default function Ovecky() {
  const [sheepList, setSheepList] = useState([]);
  const [count, setCount] = useState(0);

  const handleLaunchSheep = () => {
    const id = Date.now();
    const newSheep = { id };
    
    setSheepList(prev => [...prev, newSheep]);

    // Počítadlo naskočí přesně v momentě skoku (uprostřed animace)
    setTimeout(() => {
      setCount(prev => prev + 1);
    }, 1000);

    // Po skončení animace vyčistíme ovečku z paměti
    setTimeout(() => {
      setSheepList(prev => prev.filter(s => s.id !== id));
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Opraveno: Animace zprava doleva, aby ovečka běžela čelem napřed */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes snovySkok {
          0% { right: -10%; top: 70%; transform: scale(0.8) rotate(0deg); }
          45% { right: 45%; top: 25%; transform: scale(1.1) rotate(10deg); }
          55% { right: 55%; top: 25%; transform: scale(1.1) rotate(-10deg); }
          100% { right: 110%; top: 70%; transform: scale(0.8) rotate(0deg); }
        }
        .animace-ovecky {
          position: absolute;
          animation: snovySkok 2s linear forwards;
        }
      `}} />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Uklidňující počítání oveček
        </h2>
        <p className="text-slate-400 text-sm">
          Klepněte kamkoliv do noční oblohy. Z pravé strany vyběhne nadýchaná ovečka a pomůže dětským očím sledovat plynulý, uspávací pohyb.
        </p>
      </div>

      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest bg-slate-900/40 border border-slate-800/60 px-4 py-2 rounded-xl">
          Přeskočilo oveček: <span className="text-white font-bold ml-1">{count}</span>
        </span>
        {count > 0 && (
          <button onClick={() => setCount(0)} className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer">
            <RotateCcw size={12} /> <span>Vynulovat</span>
          </button>
        )}
      </div>

      <div 
        onClick={handleLaunchSheep}
        className="relative w-full aspect-[16/9] bg-gradient-to-b from-[#020107] via-[#090514] to-[#040209] border border-slate-900 rounded-3xl overflow-hidden select-none shadow-2xl cursor-pointer group"
      >
        {/* Hvězdy */}
        <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" />
        <div className="absolute top-20 right-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full opacity-60 animate-ping duration-1000" />

        {/* Spící měsíc */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
          <span className="text-7xl md:text-8xl filter drop-shadow-[0_0_25px_rgba(251,191,36,0.25)]">🌙</span>
        </div>

        {/* Dřevěný plot */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 flex items-end justify-center pointer-events-none z-10 opacity-70">
          <div className="w-2 h-14 bg-amber-900/40 border-r border-amber-950/40 mx-2 rounded-t" />
          <div className="w-full h-3 bg-amber-900/40 absolute bottom-8 rounded" />
          <div className="w-full h-3 bg-amber-900/40 absolute bottom-3 rounded" />
          <div className="w-2 h-14 bg-amber-900/40 border-l border-amber-950/40 mx-2 rounded-t" />
        </div>

        {/* Živé skákající ovečky */}
        {sheepList.map((sheep) => (
          <div key={sheep.id} className="animace-ovecky z-20 flex flex-col items-center select-none">
            <span className="text-5xl md:text-6xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">🐑</span>
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950 to-transparent opacity-90 flex items-center justify-between px-8 text-slate-900/20 pointer-events-none">
          <Cloud size={40} /><Cloud size={50} />
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
          <a href="https://www.alza.cz/hracky/pro-nejmenshi-plysaci/18851509.htm?idp=23293" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md">
            <ShoppingBag size={13} /> <span>Prohlédnout hračky</span>
          </a>
        </div>
      </div>
    </div>
  );
}
