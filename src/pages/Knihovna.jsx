import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Info } from 'lucide-react';

const TAB_LABELS = {
  'vse': 'Vše z knihovny',
  'Pohádka': 'Pohádky',
  'Říkadlo': 'Říkadla',
  'Písnička': 'Písničky'
};

// Slovník pro dynamické texty tlačítek se správným skloňováním
const BUTTON_LABELS = {
  'Pohádka': 'Přejít na pohádku →',
  'Říkadlo': 'Přejít na říkadlo →',
  'Písnička': 'Přejít na písničku →'
};

export default function Knihovna() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('vse');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/get-library')
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Chyba serveru (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
          setFilteredItems(data);
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
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 mb-4">
          Místo pro klidné usínání
        </h2>
        <p class="text-slate-400">
          Pohádky čtené mým vlastním hlasem doplněné o ručně kreslené ilustrace na hnědém papíře.
        </p>
      </div>

      {/* Záložky filtrů */}
      <div class="flex justify-center flex-wrap gap-2 mb-10 border-b border-slate-900 pb-4">
        {['vse', 'Pohádka', 'Říkadlo', 'Písnička'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            class={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* STAV: NAČÍTÁNÍ */}
      {loading && (
        <div class="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div class="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p class="text-sm font-medium tracking-wide">Otevírám velkou pohádkovou knihu...</p>
        </div>
      )}

      {/* STAV: CHYBA */}
      {!loading && error && (
        <div class="max-w-xl mx-auto bg-red-950/30 border border-red-500/30 p-6 rounded-2xl text-center space-y-3 my-6">
          <div class="inline-flex text-red-400"><AlertTriangle size={32} /></div>
          <h4 class="text-lg font-bold text-red-200">Propojení s Notion selhalo</h4>
          <p class="text-sm text-slate-400">
            Chyba: <code class="bg-red-950 px-2 py-0.5 rounded text-red-300 text-xs font-mono">{error}</code>
          </p>
        </div>
      )}

      {/* STAV: PRÁZDNÁ DATABÁZE */}
      {!loading && !error && filteredItems.length === 0 && (
        <div class="max-w-xl mx-auto bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center space-y-3 my-6">
          <div class="inline-flex text-amber-400"><Info size={28} /></div>
          <h4 class="text-base font-bold text-slate-200">Knihovna je momentálně prázdná</h4>
        </div>
      )}

      {/* STAV: ÚSPĚCH - ZOBRAZENÍ KARET */}
      {!loading && !error && filteredItems.length > 0 && (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredItems.map(item => (
            <Link 
              key={item.id} 
              to={`/${item.slug}`} 
              class="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all flex flex-col"
            >
              {/* Náhledový obrázek / Elegantní obálka pro říkadla */}
              <div class="aspect-video w-full overflow-hidden relative bg-slate-950">
                {item.type === 'Říkadlo' ? (
                  /* Černé minimalistické pozadí s patkovým fontem pro říkadla */
                  <div class="w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center select-none border-b border-slate-900/50 group-hover:bg-slate-950 transition-colors duration-300">
                    <span class="text-[10px] tracking-widest uppercase text-amber-500/50 font-mono mb-2">říkadlo</span>
                    <h4 class="font-serif text-xl md:text-2xl text-amber-100/90 font-medium italic px-2 line-clamp-2 leading-snug">
                      „{item.title}“
                    </h4>
                  </div>
                ) : (
                  /* Standardní YouTube náhled pro pohádky a písničky */
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" 
                  />
                )}
                
                {/* Štítek s typem obsahu */}
                <span class="absolute top-2 left-2 bg-slate-950/80 text-amber-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-800">
                  {item.type}
                </span>
              </div>

              {/* Informace pod náhledem */}
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.autor && <p class="text-xs text-slate-400 mt-1">{item.autor}</p>}
                </div>
                
                {/* Dynamické tlačítko se správným českým skloňováním */}
                <div class="text-xs text-amber-400/80 font-medium mt-4 group-hover:text-amber-400 transition-colors">
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
