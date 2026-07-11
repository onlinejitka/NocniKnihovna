import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Knihovna from './pages/Knihovna';
import PohadkaDetail from './pages/PohadkaDetail';
import Hadanky from './pages/Hadanky';
import Omalovanky from './pages/Omalovanky';
import Hra from './pages/Hra';
import Souhvezdi from './pages/Souhvezdi';
import Pexeso from './pages/Pexeso';
import VOP from './pages/VOP';
import GDPR from './pages/GDPR';
import { BookOpen, HelpCircle, Sparkles, Palette, Lightbulb, Star, LayoutGrid, Menu, X, ChevronDown, Gamepad2, Info } from 'lucide-react';

function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('sl_cookies_confirmed_2026');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sl_cookies_confirmed_2026', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-950/98 border border-slate-800 p-5 rounded-2xl shadow-2xl z-50 animate-fade-in backdrop-blur-md flex flex-col space-y-4">
      <div className="flex items-start space-x-3">
        <Info size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Informace o souborech cookies</h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tento web používá nezbytné technické cookies pro správné fungování (uložení Premium kódu). Dále využíváme cookies třetích stran pro spuštění videí z <strong>YouTube</strong>, přehrávání hudby ze <strong>Spotify</strong> a pro správnou funkčnost doporučujících partnerských odkazů.
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-3 items-center text-[10px]">
        <Link to="/gdpr" className="text-slate-500 hover:text-slate-300 transition underline">Více informací</Link>
        <button 
          onClick={handleAccept}
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl transition cursor-pointer shadow-lg"
        >
          Přijmout vše
        </button>
      </div>
    </div>
  );
}

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const closeMenu = () => setIsMobileMenuOpen(false);
  const isGamesActive = currentPath === '/hra' || currentPath === '/souhvezdi' || currentPath === '/pexeso';

  return (
    <header className="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        <Link to="/" onClick={closeMenu} className="flex items-center space-x-3 cursor-pointer">
          <span className="text-3xl">🌙</span>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-amber-400">Noční Knihovna</h1>
            <p className="text-xs text-slate-400">Klidné usínání plné příběhů</p>
          </div>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-amber-400 hover:bg-slate-900 rounded-xl transition"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className="hidden md:flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          <Link to="/" className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
            <BookOpen size={14} /> <span>Knihovna</span>
          </Link>
          <Link to="/hadanky" className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/hadanky' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
            <HelpCircle size={14} /> <span>Hádanky</span>
          </Link>
          <Link to="/omalovanky" className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/omalovanky' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
            <Palette size={14} /> <span>Omalovánky</span>
          </Link>

          <div className="relative group">
            <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center space-x-1.5 ${isGamesActive ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>
              <Gamepad2 size={14} /> <span>Hry</span> <ChevronDown size={14} className="opacity-70 transition-transform group-hover:rotate-180" />
            </button>
            
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link to="/hra" className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm transition ${currentPath === '/hra' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'}`}>
                <Lightbulb size={14} className={currentPath === '/hra' ? 'text-amber-400' : 'text-slate-400'} /> 
                <span>Světlušky</span>
              </Link>
              <Link to="/souhvezdi" className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm transition mt-1 ${currentPath === '/souhvezdi' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'}`}>
                <Star size={14} className={currentPath === '/souhvezdi' ? 'text-amber-300' : 'text-slate-400'} /> 
                <span>Souhvězdí</span>
              </Link>
              <Link to="/pexeso" className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm transition mt-1 ${currentPath === '/pexeso' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'}`}>
                <LayoutGrid size={14} className={currentPath === '/pexeso' ? 'text-amber-300' : 'text-slate-400'} /> <span>Stínové pexeso</span>
              </Link>
            </div>
          </div>

          <a href="https://generator.nocniknihovna.cz" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 group">
            <Sparkles size={14} className="text-indigo-400 group-hover:animate-pulse" /> <span>Generátor</span>
          </a>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 py-6 flex flex-col space-y-3 shadow-2xl z-50 animate-fade-in h-[calc(100vh-80px)] overflow-y-auto">
          <Link to="/" onClick={closeMenu} className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium transition ${currentPath === '/' ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300'}`}>
            <BookOpen size={18} /> <span>Knihovna</span>
          </Link>
          <Link to="/hadanky" onClick={closeMenu} className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium transition ${currentPath === '/hadanky' ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300'}`}>
            <HelpCircle size={18} /> <span>Hádanky</span>
          </Link>
          <Link to="/omalovanky" onClick={closeMenu} className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium transition ${currentPath === '/omalovanky' ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300'}`}>
            <Palette size={18} /> <span>Omalovánky</span>
          </Link>

          <div className="bg-slate-900/50 rounded-2xl p-3 border border-slate-800 mt-2 shadow-inner">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-3">Uklidňující hry</p>
            <Link to="/hra" onClick={closeMenu} className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition ${currentPath === '/hra' ? 'bg-slate-800 text-amber-400 shadow-md' : 'text-slate-300'}`}>
              <Lightbulb size={18} className={currentPath === '/hra' ? 'text-amber-400' : 'text-slate-400'} /> <span>Světlušky</span>
            </Link>
            <Link to="/souhvezdi" onClick={closeMenu} className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition mt-1 ${currentPath === '/souhvezdi' ? 'bg-slate-800 text-amber-400 shadow-md' : 'text-slate-300'}`}>
              <Star size={18} className={currentPath === '/souhvezdi' ? 'text-amber-300' : 'text-slate-400'} /> <span>Souhvězdí</span>
            </Link>
            <Link to="/pexeso" onClick={closeMenu} className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition mt-1 ${currentPath === '/pexeso' ? 'bg-slate-800 text-amber-400 shadow-md' : 'text-slate-300'}`}>
              <LayoutGrid size={18} className={currentPath === '/pexeso' ? 'text-amber-300' : 'text-slate-400'} /> <span>Stínové pexeso</span>
            </Link>
          </div>

          <a href="https://generator.nocniknihovna.cz" target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium text-slate-300 hover:text-white mt-4 border border-slate-800 bg-slate-900/30">
            <Sparkles size={18} className="text-indigo-400" /> <span>Generátor pohádek na míru</span>
          </a>
        </div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-200 selection:bg-amber-500/30 selection:text-amber-200 flex flex-col">
        <Header />
        
        <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-10">
          <Routes>
            <Route path="/" element={<Knihovna />} />
            <Route path="/hadanky" element={<Hadanky />} />
            <Route path="/omalovanky" element={<Omalovanky />} />
            <Route path="/hra" element={<Hra />} />
            <Route path="/souhvezdi" element={<Souhvezdi />} />
            <Route path="/pexeso" element={<Pexeso />} />
            <Route path="/obchodni-podminky" element={<VOP />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/:slug" element={<PohadkaDetail />} />
          </Routes>
        </main>
        
        <footer className="border-t border-slate-900 bg-slate-950/60 text-slate-500 py-10 text-center text-xs mt-auto px-4 space-y-6">
          <div className="space-y-1.5">
            <p>© {new Date().getFullYear()} Noční Knihovna. Všechna práva vyhrazená.</p>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Veškeré nahrávky pro Vás zaznamenávám svým vlastním hlasem. Ilustrace jsou spoluvytvářené s pomocí AI a mnou ručně graficky upravené. Omalovánky ve videích následně vybarvuji já nebo mé děti.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-900/60 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="font-semibold text-slate-400">Provozovatel: Jitka Pekárková</p>
              <p>Sídlo: Primátorská 38, Praha 8 • IČO: 87458021</p>
              <p>Fyzická osoba zapsaná v živnostenském rejstříku.</p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-x-3 gap-y-2 font-medium">
              <a href="https://jitkap.cz" target="_blank" rel="noopener noreferrer" className="text-amber-500/80 hover:text-amber-400 transition underline decoration-amber-500/20">
                O autorce
              </a>
              <span className="text-slate-800">•</span>
              <a href="https://navigator40k.cz" target="_blank" rel="noopener noreferrer" className="text-indigo-400/80 hover:text-indigo-400 transition underline decoration-indigo-500/20">
                Navigátor 40k
              </a>
              <span className="text-slate-800 hidden sm:inline">•</span>
              <Link to="/obchodni-podminky" className="hover:text-slate-400 transition">
                Obchodní podmínky
              </Link>
              <span className="text-slate-800">•</span>
              <Link to="/gdpr" className="hover:text-slate-400 transition">
                GDPR
              </Link>
            </div>
          </div>
        </footer>

        <CookieBar />
      </div>
    </Router>
  );
}
