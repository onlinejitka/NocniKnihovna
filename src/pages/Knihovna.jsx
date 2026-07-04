import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TAB_LABELS = {
  'vse': 'Vše z knihovny',
  'Pohádka': 'Pohádky',
  'Říkadlo': 'Říkadla',
  'Písnička': 'Písničky'
};

export default function Knihovna() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('vse');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-library')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
          setFilteredItems(data);
        }
        setLoading(false); // Opraveno: Načítání se teď korektně ukončí!
      })
      .catch(err => {
        console.error("Chyba při načítání dat z Notion:", err);
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

      {/* Načítání / Mřížka karet */}
      {loading ? (
        <div class="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div class="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p class="text-sm font-medium tracking-wide">Otevírám velkou pohádkovou knihu...</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Link 
              key={item.id} 
              to={`/${item.slug}`} 
              class="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all flex flex-col"
            >
              <div class="aspect-video w-full overflow-hidden relative bg-slate-950">
                <img src={item.thumbnail} alt={item.title} class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                <span class="absolute top-2 left-2 bg-slate-950/80 text-amber-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-800">{item.type}</span>
              </div>
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                  {item.autor && <p class="text-xs text-slate-400 mt-1">{item.autor}</p>}
                </div>
                <div class="text-xs text-amber-400/80 font-medium mt-4">Přejít na pohádku →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
