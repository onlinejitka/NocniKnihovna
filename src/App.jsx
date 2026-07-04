import React, { useState, useEffect } from 'react';
import { BookOpen, Music, Sparkles, Youtube, ShoppingBag, Moon, Sun, ArrowLeft } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState('vse'); // vse, Pohádka, Říkadlo, Písnička
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Načtení dat z API
  useEffect(() => {
    fetch('/api/get-library')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
          setFilteredItems(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Chyba načítání dat:", err);
        setLoading(false);
      });
  }, []);

  // Filtrování karet
  useEffect(() => {
    if (activeTab === 'vse') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === activeTab));
    }
  }, [activeTab, items]);

  // Načtení detailu konkrétní pohádky
  const openItem = (slug) => {
    setLoading(true);
    fetch(`/api/get-library?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setSelectedItem(data);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div class="min-h-screen text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Hlavička */}
      <header class="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div class="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedItem(null)}>
            <span class="text-3xl">🌙</span>
            <div>
              <h1 class="text-xl font-bold tracking-wide text-amber-400">Noční Knihovna</h1>
              <p class="text-xs text-slate-400">Klidné usínání plné příběhů</p>
            </div>
          </div>
          <nav class="flex items-center space-x-4 text-sm font-medium">
            <a href="https://youtube.com" target="_blank" class="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition">
              <Youtube size={18} /> <span class="hidden md:inline">YouTube</span>
            </a>
            <a href="https://herohero.co" target="_blank" class="flex items-center space-x-1 text-slate-400 hover:text-pink-400 transition">
              <Sparkles size={18} /> <span class="hidden md:inline">HeroHero</span>
            </a>
          </nav>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-4 py-10">
        {selectedItem ? (
          /* DETAIL POHÁDKY / OBSAHU */
          <div class="max-w-4xl mx-auto animate-fade-in">
            <button 
              onClick={() => setSelectedItem(null)}
              class="flex items-center space-x-2 text-slate-400 hover:text-amber-400 mb-8 transition group"
            >
              <ArrowLeft size={18} class="transform group-hover:-translate-x-1 transition-transform" />
              <span>Zpět do knihovny</span>
            </button>

            <h2 class="text-4xl font-bold text-amber-400 mb-2">{selectedItem.title}</h2>
            <span class="inline-block bg-slate-800 text-amber-300 text-xs px-3 py-1 rounded-full font-medium mb-8">
              {selectedItem.type}
            </span>

            {/* Média – YouTube Video s kreslením */}
            {selectedItem.youtubeId && (
              <div class="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mb-8 bg-slate-900">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedItem.youtubeId}`}
                  title={selectedItem.title}
                  class="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Média – Spotify Audio */}
            {selectedItem.spotifyId && (
              <div class="mb-10">
                <iframe 
                  src={`https://open.spotify.com/embed/track/${selectedItem.spotifyId}?utm_source=generator&theme=0`} 
                  width="100%" 
                  height="152" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  class="rounded-xl border border-slate-800"
                ></iframe>
              </div>
            )}

            {/* Text pohádky z Notion */}
            <div 
              class="prose prose-invert max-w-none bg-slate-900/40 p-8 rounded-2xl border border-slate-800/60 shadow-xl"
              dangerouslySetInnerHTML={{ __html: selectedItem.content }}
            />
          </div>
        ) : (
          /* SEZNAM OBSAHU & ÚVOD */
          <div>
            {/* Úvodní upoutávka */}
            <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
                Místo, kde ožívají sny
              </h2>
              <p class="text-slate-400 leading-relaxed text-lg">
                Pohádky čtené mým vlastním hlasem doplněné o ručně kreslené ilustrace. Poslouchejte texty, zpívejte lidové písničky a dopřejte dětem kouzelné usínání.
              </p>
              <div class="flex justify-center space-x-4 pt-2">
                <a href="https://herohero.co" target="_blank" class="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-medium px-6 py-2.5 rounded-full shadow-lg hover:shadow-pink-500/20 transition flex items-center space-x-2 text-sm">
                  <Sparkles size={16} />
                  <span>Podpořit na HeroHero (Bonusy)</span>
                </a>
              </div>
            </div>

            {/* Filtrovací záložky */}
            <div class="flex justify-center space-x-2 md:space-x-4 mb-10 border-b border-slate-800 pb-4">
              {[
                { id: 'vse', label: 'Vše z knihovny', icon: <BookOpen size={16} /> },
                { id: 'Pohádka', label: 'Pohádky', icon: '📖' },
                { id: 'Říkadlo', label: 'Říkadla', icon: '📝' },
                { id: 'Písnička', label: 'Písničky', icon: <Music size={16} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  class={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === tab.id 
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/10' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Načítání */}
            {loading && (
              <div class="text-center py-20 text-slate-400">
                <div class="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mb-4"></div>
                <p>Otevírám Noční Knihovnu...</p>
              </div>
            )}

            {/* Mřížka s obsahem */}
            {!loading && filteredItems.length === 0 && (
              <div class="text-center py-20 text-slate-500">Zatím tu žádný poklad v této sekci není.</div>
            )}

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => openItem(item.slug)}
                  class="group bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Náhledovka z YouTube */}
                  <div class="aspect-video w-full overflow-hidden relative bg-slate-950">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-amber-400 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-800">
                      {item.type}
                    </span>
                  </div>
                  {/* Info */}
                  <div class="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-slate-950/40">
                    <h3 class="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div class="text-xs text-amber-400/70 font-semibold mt-4 flex items-center space-x-1 group-hover:text-amber-400 transition-colors">
                      <span>Číst a pustit</span> <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Spodní panel - Výhled do budoucna */}
            <div class="border-t border-slate-900 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/60 flex space-x-4">
                <div class="bg-amber-400/10 text-amber-400 p-3 h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h4 class="font-bold text-lg text-slate-200">Chystaný obchůdek</h4>
                  <p class="text-sm text-slate-400 mt-1">Brzy pro vás otevřeme Etsy obchod plný krásných autorských produktů (Print-on-demand) s ilustracemi z našich pohádek.</p>
                </div>
              </div>

              <div class="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/60 flex space-x-4">
                <div class="bg-indigo-400/10 text-indigo-400 p-3 h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
                  <Moon size={24} />
                </div>
                <div>
                  <h4 class="font-bold text-lg text-slate-200">Plánovaná aplikace pro děti</h4>
                  <p class="text-sm text-slate-400 mt-1">Sestavte si večerní playlist! Dítě si navolí až 3 pohádky a 3 písničky na dobrou noc. Uvažujeme také o generátoru unikátních pohádek pomocí AI podle věku děťátka.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <footer class="border-t border-slate-900 mt-20 bg-slate-950/60 text-slate-500 py-8 text-center text-xs">
        <p>© {new Date().getFullYear()} Noční Knihovna. Všechna práva vyhrazena.</p>
        <p class="mt-1 text-slate-600">Čtené s láskou, kreslené ručně.</p>
      </footer>
    </div>
  );
}
