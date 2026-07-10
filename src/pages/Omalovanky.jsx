import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Download, Lock, Palette } from 'lucide-react';

const TYPE_LABELS = {
  'Pohádka': 'Pohádka',
  'Říkadlo': 'Říkadlo',
  'Písnička': 'Písnička'
};

export default function Omalovanky() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCode = localStorage.getItem('sl_passcode') || '';
    setLoading(true);
    
    fetch(`/api/get-library?passcode=${savedCode}`)
      .then(async res => {
        if (!res.ok) throw new Error('Nepodařilo se načíst knihovnu pro omalovánky.');
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.items)) {
          const allSheets = [];

          // Projdeme každý příspěvek a rozložíme jeho omalovánky do samostatných karet
          data.items.forEach(item => {
            // 1. Přidáme hlavní omalovánku (pokud existuje - je vždy Zdarma)
            if (item.urlOmalovankyHlavni) {
              allSheets.push({
                id: `${item.id}-hlavni`,
                title: item.title,
                slug: item.slug,
                type: item.type,
                imageUrl: item.urlOmalovankyHlavni,
                isPremium: false
              });
            }

            // 2. Přidáme prémiové omalovánky (pokud existují)
            if (item.premiumImages && item.premiumImages.length > 0) {
              item.premiumImages.forEach((imgUrl, index) => {
                allSheets.push({
                  id: `${item.id}-premium-${index}`,
                  title: item.title,
                  slug: item.slug,
                  type: item.type,
                  imageUrl: imgUrl,
                  isPremium: true,
                  label: `Prémiový list 0${index + 1}`
                });
              });
            }
          });

          setSheets(allSheets);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      {/* Hlavička stránky */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Velká galerie omalovánek
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Prohlédněte si všechny kreativní listy k našim pohádkám, písničkám a říkadlům. Základní omalovánky jsou k dispozici zcela zdarma, rozšířené sady pak čekají na naše Premium členy.
        </p>
      </div>

      {/* STAV: NAČÍTÁNÍ */}
      {loading && (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium tracking-wide">Připravuji malířská plátna a pastelky...</p>
        </div>
      )}

      {/* STAV: CHYBA */}
      {!loading && error && (
        <div className="max-w-xl mx-auto bg-red-950/30 border border-red-500/30 p-6 rounded-2xl text-center space-y-3">
          <div className="inline-flex text-red-400"><AlertTriangle size={32} /></div>
          <h4 className="text-lg font-bold text-red-200">Chyba při načítání galerie</h4>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      )}

      {/* STAV: PRÁZDNO */}
      {!loading && !error && sheets.length === 0 && (
        <div className="max-w-xl mx-auto bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center text-slate-400">
          <p className="text-sm font-medium">V databázi momentálně nejsou nahrané žádné omalovánky.</p>
        </div>
      )}

      {/* STAV: ZOBRAZENÍ GALERIE */}
      {!loading && !error && sheets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {sheets.map(sheet => (
            <div 
              key={sheet.id}
              className="group bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition"
            >
              {/* Náhledový obrázek v poměru 4:3 */}
              <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden border-b border-slate-900 select-none">
                <img 
                  src={sheet.imageUrl} 
                  alt={`Omalovánka - ${sheet.title}`} 
                  className={`w-full h-full object-cover transition duration-300 group-hover:scale-102 ${
                    sheet.isPremium ? 'opacity-25 filter blur-[0.5px]' : 'opacity-85'
                  }`}
                />
                
                {/* Dynamický ochranný zámek pro Premium soubory */}
                {sheet.isPremium && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={16} className="text-amber-400 bg-slate-950/80 p-1.5 w-8 h-8 rounded-full border border-slate-800 shadow" />
                  </div>
                )}

                {/* Štítek typu členství (Zdarma / Premium) */}
                <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  sheet.isPremium 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {sheet.isPremium ? 'Premium' : 'Zdarma'}
                </span>
              </div>

              {/* Spodní textový obsah karty */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  {/* Informace, o jaký typ obsahu se jedná */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {TYPE_LABELS[sheet.type] || 'Obsah'} {sheet.label ? `• ${sheet.label}` : ''}
                  </span>
                  
                  {/* Proklikávatelný název směřující na detail pohádky/písničky */}
                  <Link 
                    to={`/${sheet.slug}`}
                    className="text-sm font-bold text-slate-200 hover:text-amber-400 transition line-clamp-2 block leading-snug"
                  >
                    {sheet.title}
                  </Link>
                </div>

                {/* Rychlý odkaz pod kartou */}
                <div className="text-[11px] font-medium text-slate-400 pt-1 border-t border-slate-900">
                  <Link to={`/${sheet.slug}`} className="hover:underline flex items-center space-x-1 text-amber-500/80 hover:text-amber-400">
                    <span>Otevřít balíček →</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
