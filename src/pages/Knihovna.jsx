import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Info, Music } from 'lucide-react';

const TAB_LABELS = {
  'vse': 'Vše z knihovny',
  'Pohádka': 'Pohádky',
  'Říkadlo': 'Říkadla',
  'Písnička': 'Písničky'
};

const BUTTON_LABELS = {
  'Pohádka': 'Přejít na pohádku →',
  'Říkadlo': 'Přejít na říkadlo →',
  'Písnička': 'Přejít na písničku →'
};

// HLAVNÍ OPRAVA: Výslovný export default, který Vercel vyžaduje
export default function Knihovna() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('vse');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCode = localStorage.getItem('sl_passcode') || '';
    setLoading(true);
    fetch(`/api/get-library?passcode=${savedCode}`)
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Chyba serveru (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.items)) {
          setItems(data.items);
          setFilteredItems(data.items);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === 'vse') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === activeTab));
    }
  }, [activeTab, items]);

  return (
    <div>
      {/* Úvodní představení projektu */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Místo pro klidné usínání
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed px-2">
          Pohádky vyprávěné mým vlastním hlasem doprovází zrychlené video, ve kterém ručně vybarvuji originální ilustrace. Podklady si tvořím s pomocí AI a ladím v grafickém programu. 
        </p>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed px-4">
          Většinu omalovánek k pohádkám si zde můžete <span className="text-amber-400 font-semibold">zdarma stáhnout jako obrázek či PDF</span> a vybarvit si je s dětmi. Časem přibudou omalovánky k říkadlům i písničkám a lidové písně pro vás také sama nazpívám, abyste snadno chytili správnou melodii.
        </p>
      </div>

      {/* Dvouúrovňové záložky filtrů */}
      <div className="flex flex-col items-center space-y-4 mb-12 border-b border-slate-900 pb-6">
        <div>
          <button 
            onClick={() => setActiveTab('vse')} 
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition tracking-wide ${
              activeTab === 'vse' 
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/10' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {TAB_LABELS['vse']}
          </button>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2">
          {['Pohádka', 'Říkadlo', 'Písnička'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-5 py-1.5 rounded-full text-xs md:text-sm font-medium transition ${
                activeTab === tab 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* STAV: NAČÍTÁNÍ */}
      {loading && (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium tracking-wide">Otevírám velkou pohádkovou knihu...</p>
        </div>
      )}

      {/* STAV: CHYBA */}
      {!loading && error && (
        <div className="max-w-xl mx-auto bg-red-950/30 border border-red-500/30 p-6 rounded-2xl text-center space-y-3 my-6">
          <div className="inline-flex text-red-400"><AlertTriangle size={32} /></div>
          <h4 className="text-lg font-bold text-red-200">Propojení s Notion selhalo</h4>
        </div>
      )}

      {/* STAV: PRÁZDNÁ DATABÁZE */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="max-w-xl mx-auto bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center space-y-3 my-6">
          <div className="inline-flex text-amber-400"><Info size={28} /></div>
          <h4 className="text-base font-bold text-slate-200">Knihovna je momentálně prázdná</h4>
        </div>
      )}

      {/* STAV: ÚSPĚCH */}
      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredItems.map(item => (
            <Link 
              key={item.id} 
              to={`/${item.slug}`} 
              className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden relative bg-slate-950">
                {item.type === 'Říkadlo' ? (
                  <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center select-none border-b border-slate-900/50 group-hover:bg-slate-950 transition-colors duration-300">
                    <span className="text-[10px] tracking-widest uppercase text-amber-500/50 font-mono mb-2">říkadlo</span>
                    <h4 className="font-serif text-xl md:text-2xl text-amber-100/90 font-medium italic px-2 line-clamp-2 leading-snug">
                      „{item.title}“
                    </h4>
                  </div>
                ) : item.type === 'Písnička' ? (
                  <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center select-none border-b border-slate-900/50 group-hover:bg-slate-950 transition-colors duration-300">
                    <div className="text-amber-100/90 mb-1.5 transform group-hover:scale-110 transition-transform duration-300">
                      <Music size={22} />
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-amber-500/50 font-mono mb-2">písnička</span>
                    <h4 className="font-serif text-xl md:text-2xl text-amber-100/90 font-medium italic px-2 line-clamp-2 leading-snug">
                      „{item.title}“
                    </h4>
                  </div>
                ) : (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                )}
                
                <span className="absolute top-2 left-2 bg-slate-950/80 text-amber-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-800">
                  {item.type}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.autor && <p className="text-xs text-slate-400 mt-1">{item.autor}</p>}
                </div>
                
                <div className="text-xs text-amber-400/80 font-medium mt-4 group-hover:text-amber-400 transition-colors">
                  {BUTTON_LABELS[item.type] || 'Otevřít obsah →'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
