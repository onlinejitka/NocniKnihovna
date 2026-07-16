import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Sparkles, Star, ArrowRight, HelpCircle, ShoppingBag } from 'lucide-react';

// Seznam slov pro děti s nápovědou (emodži + text)
const WORDS_DATABASE = [
  { word: 'SOVA', hint: '🦉 Noční ptáček, který v noci nespí a hlídá les.' },
  { word: 'MĚSÍC', hint: '🌙 Svítí na nás z oblohy, když jdeme spát.' },
  { word: 'HVĚZDA', hint: '⭐ Malé třpytivé světýlko na tmavém nebi.' },
  { word: 'KNIHA', hint: '📖 Je plná pohádek, obrázků a krásného čtení.' },
  { word: 'LES', hint: '🌲 Rostou tu stromy, houby a bydlí tu zvířátka.' },
  { word: 'DOMOV', hint: '🏡 Místo, kde je nám nejtepleji a máme tam svou postýlku.' },
  { word: 'POSTÝLKA', hint: '🛏️ Naše měkoučké hnízdečko, kam se večer zachumláme.' },
  { word: 'POHÁDKA', hint: '🧚 Tajuplný vyprávěný příběh o princeznách, dracích nebo skřítcích.' },
  { word: 'POLŠTÁŘ', hint: '☁️ Měkký obláček, na který si večer položíme unavenou hlavičku.' },
  { word: 'PEŘINA', hint: '🛌 Teplý nadýchaný mrak, který nás v noci hřeje a chrání.' },
  { word: 'USÍNÁČEK', hint: '🧸 Plyšový kamarád, kterého pevně objímáme při usínání.' },
  { word: 'SEN', hint: '💭 Krásné dobrodružství, které prožíváme se zavřenýma očima.' },
  { word: 'SKŘÍTEK', hint: '🧝 Malý kouzelný tvoreček, který v noci hlídá dětské sny.' },
  { word: 'SVĚTLUŠKA', hint: '🪰 Malinký brouček, který si ve tmě svítí jako lucernička.' },
  { word: 'KOČKA', hint: '🐈 Vrnící chlupaté zvířátko, které se rádo tulí v peřinách.' },
  { word: 'STROM', hint: '🌳 Zelený obr v lese, na jehož větvích v noci spí ptáčci.' },
  { word: 'ZÁMEK', hint: '🏰 Velký tajuplný dům s věžemi, kde spí zakletá princezna.' },
  { word: 'VÍLA', hint: '🧚 Kouzelná lesní bytost s křídly, která tančí za svitu měsíce.' },
  { word: 'PYŽAMO', hint: '👕 Naše pohodlné noční oblečení, do kterého vklouzneme před spaním.' },
  { word: 'SVÍČKA', hint: '🕯️ Malý hřejivý plamínek, který nám večer svítí u postýlky.' },
  { word: 'MEDVĚD', hint: '🐻 Velký huňatý spáč, který dokáže prospat celou dlouhou zimu.' }
];

export default function Scrabble() {
  // Náhodný výběr slova hned na začátku
  const [wordIndex, setWordIndex] = useState(() => Math.floor(Math.random() * WORDS_DATABASE.length));
  const [currentWordData, setCurrentWordData] = useState(WORDS_DATABASE[wordIndex]);
  
  const [placedLetters, setPlacedLetters] = useState([]);
  const [letterPool, setLetterPool] = useState([]);
  
  // ROZDĚLENÉ STAVY: 1. Slovo je správně (písmo zelená + hvězdy) | 2. Vyhodnocovací okno
  const [isWordSpelledCorrectly, setIsWordSpelledCorrectly] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  
  const [shakeError, setShakeError] = useState(false);
  const [starParticles, setStarParticles] = useState([]);

  // Inicializace nového slova
  const initWord = (index) => {
    const data = WORDS_DATABASE[index];
    setCurrentWordData(data);
    setIsWordSpelledCorrectly(false);
    setShowWinModal(false);
    setShakeError(false);
    setStarParticles([]);

    setPlacedLetters(Array(data.word.length).fill(null));

    const correctLetters = data.word.split('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
    const extraLetters = Array(2).fill(null).map(() => alphabet[Math.floor(Math.random() * alphabet.length)]);
    
    const allLetters = [...correctLetters, ...extraLetters]
      .map((char, i) => ({ id: i, char, used: false }))
      .sort(() => Math.random() - 0.5);

    setLetterPool(allLetters);
  };

  useEffect(() => {
    initWord(wordIndex);
  }, [wordIndex]);

  // Přesun z dolní nabídky nahoru
  const handlePoolLetterClick = (clickedItem) => {
    if (isWordSpelledCorrectly || clickedItem.used) return;

    const firstEmptyIndex = placedLetters.indexOf(null);
    if (firstEmptyIndex === -1) return;

    const newPlaced = [...placedLetters];
    newPlaced[firstEmptyIndex] = { poolId: clickedItem.id, char: clickedItem.char };
    setPlacedLetters(newPlaced);

    setLetterPool(prev => prev.map(item => 
      item.id === clickedItem.id ? { ...item, used: true } : item
    ));
  };

  // Návrat z horní pozice dolů
  const handlePlacedLetterClick = (placedItem, index) => {
    if (isWordSpelledCorrectly || !placedItem) return;

    const newPlaced = [...placedLetters];
    newPlaced[index] = null;
    setPlacedLetters(newPlaced);

    setLetterPool(prev => prev.map(item => 
      item.id === placedItem.poolId ? { ...item, used: false } : item
    ));
    
    setShakeError(false);
  };

  // KONTROLA SLOVA S ODLOŽENÝM ZOBRAZENÍM MODÁLU
  useEffect(() => {
    if (placedLetters.length === 0) return;

    const isFull = placedLetters.every(item => item !== null);
    if (isFull) {
      const spelledWord = placedLetters.map(item => item.char).join('');
      if (spelledWord === currentWordData.word) {
        setIsWordSpelledCorrectly(true);
        setShakeError(false);

        // Generování souřadnic pro oslavné létající hvězdičky
        const particles = Array.from({ length: 18 }).map((_, i) => ({
          id: i,
          left: `${15 + Math.random() * 70}%`,
          top: `${20 + Math.random() * 50}%`,
          size: Math.random() * 16 + 10,
          delay: `${Math.random() * 0.6}s`
        }));
        setStarParticles(particles);

        // Zpoždění vyhodnocovacího okna o 2.2 vteřiny
        const timer = setTimeout(() => {
          setShowWinModal(true);
        }, 2200);

        return () => clearTimeout(timer);
      } else {
        setShakeError(true);
      }
    } else {
      setIsWordSpelledCorrectly(false);
      setShowWinModal(false);
      setShakeError(false);
      setStarParticles([]);
    }
  }, [placedLetters, currentWordData]);

  // Náhodný výběr dalšího slova bez opakování
  const handleNextWord = () => {
    setWordIndex(prevIndex => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * WORDS_DATABASE.length);
      } while (newIndex === prevIndex && WORDS_DATABASE.length > 1);
      return newIndex;
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 select-none">
      
      {/* Vstříknutí CSS animací pro výbuch a vznášení slavnostních hvězd */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hvezdnaOslava {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: scale(1.6) rotate(180deg) translateY(-30px); opacity: 0; }
        }
        .animace-hvezdy {
          position: absolute;
          animation: hvezdnaOslava 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}} />
      
      {/* Hlavička hry */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Snová písmenka
        </h2>
        <p className="text-slate-400 text-sm">
          Poskládejte z rozházených písmenek správné slovo. Kliknutím na písmenko ho umístíte nebo vrátíte zpět.
        </p>
      </div>

      {/* Herní plocha */}
      <div className="bg-[#05030a] border border-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Nápověda */}
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 flex items-start space-x-3 mb-8 max-w-xl mx-auto">
          <div className="bg-amber-400/10 p-2 rounded-xl text-amber-400 shrink-0">
            <HelpCircle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Hádanka:</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{currentWordData.hint}</p>
          </div>
        </div>

        {/* Políčka pro skládání slova */}
        <div className={`flex justify-center gap-2 md:gap-3 mb-10 ${shakeError ? 'animate-bounce' : ''}`}>
          {placedLetters.map((letterItem, index) => (
            <button
              key={index}
              onClick={() => handlePlacedLetterClick(letterItem, index)}
              className={`w-12 h-14 md:w-16 md:h-20 rounded-2xl border-2 flex items-center justify-center font-bold text-xl md:text-3xl transition-all duration-300 cursor-pointer
                ${letterItem 
                  ? isWordSpelledCorrectly 
                    ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.35)] scale-105'
                    : shakeError
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_4px_10px_rgba(251,191,36,0.2)]'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-transparent'
                }`}
            >
              {letterItem?.char || ''}
            </button>
          ))}
        </div>

        {/* Spodní hromádka s písmeny k výběru */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-lg mx-auto">
          {letterPool.map((item) => (
            <button
              key={item.id}
              disabled={item.used || isWordSpelledCorrectly}
              onClick={() => handlePoolLetterClick(item)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border font-bold text-lg md:text-xl transition-all duration-200 cursor-pointer
                ${item.used 
                  ? 'bg-slate-950/20 border-slate-900/40 text-slate-700 opacity-20 scale-90'
                  : 'bg-slate-900 border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-amber-300 hover:scale-105 active:scale-95'
                }`}
            >
              {item.char}
            </button>
          ))}
        </div>

        {/* OSLAVNÉ HVĚZDIČKY: Létají po správném dokončení přes hrací plochu */}
        {isWordSpelledCorrectly && starParticles.map((star) => (
          <div 
            key={star.id} 
            className="animace-hvezdy text-amber-300 pointer-events-none"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay
            }}
          >
            <Star size={star.size} className="fill-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          </div>
        ))}

        {/* Úspěšné dokončení slova - Vyhodnocovací okno vyskočí s nastavenou prodlevou */}
        {showWinModal && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in z-20">
            <span className="text-4xl mb-3 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">✨🎉⭐</span>
            <h3 className="text-2xl font-serif font-bold text-amber-300">Správně! Jsi šikula!</h3>
            <p className="text-slate-400 text-xs md:text-sm max-w-xs mt-2 leading-relaxed">
              Slovo <strong className="text-amber-400">{currentWordData.word}</strong> jsi poskládal/a naprosto dokonale. Můžeme jít na další slovo!
            </p>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => initWord(wordIndex)} 
                className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <RotateCcw size={12} /> <span>Znovu</span>
              </button>
              <button 
                onClick={handleNextWord} 
                className="inline-flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-amber-400/10"
              >
                <span>Další slovo</span> <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Spodní Doporučující Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
          <div className="w-20 h-20 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-gradient-to-b from-slate-900 to-slate-950 text-amber-400/40">
            <Star size={24} />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
              <Sparkles size={10} /> <span>Tip po hraní</span>
            </span>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
              Hraní s písmenky krásně unaví hlavičku. Pro klidný přesun do postýlky skvěle fungují milí plyšoví usínáčci, kteří se stanou věrnými strážci krásných snových říší Vašich dětí.
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
