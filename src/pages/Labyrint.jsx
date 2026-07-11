import React, { useState, useEffect } from 'react';
import { Star, Moon, Lock, CheckCircle, RotateCcw, Sparkles, ShoppingBag, Cloud, AlertCircle } from 'lucide-react';

const GRID_SIZE = 5;

// Definice bludiště: 0 = čistý mrak (bezpečný), 1 = bouřkový mrak (překážka)
const MAZE_LAYOUT = [
  [0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0]
];

export default function Labyrint() {
  const [isUserVip, setIsUserVip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState(localStorage.getItem('sl_passcode') || '');
  const [inputCode, setInputCode] = useState(passcode);
  const [codeSaved, setCodeSaved] = useState(false);

  const [path, setPath] = useState([[0, 0]]); // Startovní pozice
  const [gameCompleted, setGameCompleted] = useState(false);
  const [stormAlert, setStormAlert] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/get-library?passcode=${passcode}`)
      .then(res => res.json())
      .then(data => {
        if (data) setIsUserVip(data.isUserVip);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [passcode]);

  const handleCloudClick = (r, c) => {
    if (!isUserVip || gameCompleted) return;

    // Pokud klikne na bouřkový mrak, vyvoláme jemné varování
    if (MAZE_LAYOUT[r][c] === 1) {
      setStormAlert(true);
      setTimeout(() => setStormAlert(false), 800);
      return;
    }

    const lastNode = path[path.length - 1];
    const [lastR, lastC] = lastNode;

    // Musí klikat pouze na bezprostředně sousedící políčka (pohyb nahoru, dolů, vlevo, vpravo)
    const isNeighbor = (Math.abs(lastR - r) === 1 && lastC === c) || (Math.abs(lastC - c) === 1 && lastR === r);
    const isAlreadyInPath = path.some(([nodeR, nodeC]) => nodeR === r && nodeC === c);

    if (isNeighbor && !isAlreadyInPath) {
      const newPath = [...path, [r, c]];
      setPath(newPath);

      if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) {
        setGameCompleted(true);
      }
    }
  };

  const initGame = () => {
    setPath([[0, 0]]);
    setGameCompleted(false);
    setStormAlert(false);
  };

  const openStripePopup = () => {
    const url = "https://buy.stripe.com/8x2fZh8CZ2H2eD73aQ9IQ0q";
    window.open(url, 'StripePremiumCheckout', 'width=500,height=710,resizable=yes,scrollbars=yes');
  };

  const handleSaveCode = (e) => {
    e.preventDefault();
    localStorage.setItem('sl_passcode', inputCode.trim());
    setPasscode(inputCode.trim());
    setCodeSaved(true);
    setTimeout(() => setCodeSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Cesta nebeské hvězdičky
        </h2>
        <p className="text-slate-400 text-sm">
          Pozor na temné bouřkové mraky! Najděte s dětmi bezpečnou svítící cestičku od zářící hvězdy (vlevo nahoře) až k měsíčku (vpravo dole).
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium">Rozsvěcím mlžný labyrint...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-center h-6">
            {stormAlert && (
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 animate-bounce">
                <AlertCircle size={14} /> <span>Pozor, tam je bouřkový mrak! Zkuste jinou cestu.</span>
              </p>
            )}
          </div>

          {/* Hrací pole labyrintu */}
          <div className={`relative max-w-md mx-auto aspect-square bg-[#030107] border rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden transition-colors duration-300 ${stormAlert ? 'border-purple-500/50 bg-purple-950/5' : 'border-slate-900'}`}>
            <div className="grid grid-cols-5 gap-3 h-full w-full relative z-10">
              {Array.from({ length: GRID_SIZE }).map((_, r) => 
                Array.from({ length: GRID_SIZE }).map((_, c) => {
                  const isStart = r === 0 && c === 0;
                  const isEnd = r === GRID_SIZE - 1 && c === GRID_SIZE - 1;
                  const isActive = path.some(([nodeR, nodeC]) => nodeR === r && nodeC === c);
                  const isLast = path[path.length - 1][0] === r && path[path.length - 1][1] === c;
                  const isStorm = MAZE_LAYOUT[r][c] === 1;

                  let cellStyle = "bg-slate-900/30 border-slate-800/60 text-slate-600 hover:border-slate-700";
                  
                  // Styl pro bouřkové překážky
                  if (isStorm) cellStyle = "bg-purple-950/20 border-purple-900/40 text-purple-400/50";
                  // Styl pro aktivovanou prošlou cestu
                  if (isActive) cellStyle = "bg-amber-500/10 border-amber-400/80 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]";
                  // Styl pro aktuální pozici hvězdičky
                  if (isLast) cellStyle = "bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_15px_#fbbf24]";

                  return (
                    <button
                      key={`${r}-${c}`}
                      disabled={!isUserVip || gameCompleted}
                      onClick={() => handleCloudClick(r, c)}
                      className={`rounded-xl border transition-all duration-300 flex items-center justify-center relative cursor-pointer ${cellStyle}`}
                    >
                      {isLast ? (
                        <Star size={18} className="animate-pulse fill-slate-950" />
                      ) : isStart ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      ) : isEnd ? (
                        <Moon size={16} className={gameCompleted ? "text-amber-400" : "text-indigo-400"} />
                      ) : isStorm ? (
                        <Cloud size={14} className="opacity-40 animate-pulse text-purple-400" />
                      ) : isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                      ) : (
                        <Cloud size={14} className="opacity-10" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Zámek přes herní plochu pro nečleny */}
            {!isUserVip && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-30">
                <div onClick={openStripePopup} className="w-14 h-16 bg-slate-900/90 rounded-full flex items-center justify-center shadow-2xl border border-slate-700 cursor-pointer hover:scale-110 transition-transform">
                  <Lock className="text-amber-500/90 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={24} />
                </div>
              </div>
            )}

            {/* Obrazovka vítězství */}
            {gameCompleted && isUserVip && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
                <span className="text-4xl mb-3 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">✨⭐🌙</span>
                <h3 className="text-xl font-serif font-bold text-amber-300">Hvězdička našla měsíček!</h3>
                <p className="text-slate-400 text-xs md:text-sm max-w-xs mt-2 leading-relaxed px-2">
                  Díky Vaší moudré navigaci proplula hvězdička bezpečně tmou. Celá obloha teď klidně svítí a vypráví sny. Je čas zavřít očička.
                </p>
                <button onClick={initGame} className="mt-5 inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"><RotateCcw size={12} /> <span>Hrát znovu</span></button>
              </div>
            )}
          </div>

          {/* Paywall a uložení e-mailu */}
          {!isUserVip && (
            <div className="max-w-xl mx-auto space-y-6 pt-4">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-xl">
                <h3 className="text-xl font-bold text-amber-300">Prémiový snový labyrint</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                  Tato logická cesta je součástí Premium balíčku Noční Knihovny. Aktivací předplatného ihned odemknete všechny prémiové hry, rozšířené omalovánky a generátor pohádek.
                </p>
                <button onClick={openStripePopup} className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wide transition cursor-pointer shadow-lg hover:opacity-95">Aktivovat Premium za 75 Kč ➔</button>
              </div>
              <form onSubmit={handleSaveCode} className="bg-slate-900/20 border border-slate-800/60 p-4 rounded-xl space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">🔑 Již máte zaplaceno? Vložte svůj e-mail pro odemčení:</label>
                <div className="flex space-x-2">
                  <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Zadejte Váš e-mail..." className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none" />
                  <button type="submit" className="bg-amber-400 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer">Odemknout</button>
                </div>
                {codeSaved && <p className="text-emerald-400 text-[11px] flex items-center space-x-1 animate-pulse"><CheckCircle size={12} /> <span>E-mail úspěšně uložen! Otevírám hru...</span></p>}
              </form>
            </div>
          )}
        </>
      )}

      {/* Spodní Affiliate Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group mt-12">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
          <div className="w-20 h-20 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-gradient-to-b from-slate-900 to-slate-950 text-amber-400/40">
            <Sparkles size={24} />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
              <Sparkles size={10} /> <span>Tip po hraní</span>
            </span>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
              Cesta úspěšně skončila. Pro klidný přesun do postýlky skvěle fungují milé plyšové hračky a usínáčci, kteří se stanou věrnými strážci krásných snových říší Vašich dětí.
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
