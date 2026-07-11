import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Knihovna from './pages/Knihovna';
import PohadkaDetail from './pages/PohadkaDetail';
import Hadanky from './pages/Hadanky';
import Omalovanky from './pages/Omalovanky';
import Hra from './pages/Hra';
import Souhvezdi from './pages/Souhvezdi';
// NOVINKA: Změnili jsme importy. Přidali jsme Lightbulb.
import { BookOpen, HelpCircle, Sparkles, Palette, Lightbulb, Star, Menu, X, ChevronDown, Gamepad2 } from 'lucide-react';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const closeMenu = () => setIsMobileMenuOpen(false);

  const isGamesActive = currentPath === '/hra' || currentPath === '/souhvezdi';

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
              {/* ODKAZ NA SVĚTLUŠKY S NOVOU IKONOU ŽÁROVKY */}
              <Link to="/hra" className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm transition ${currentPath === '/hra' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'}`}>
                <Lightbulb size={14} className={currentPath === '/hra' ? 'text-amber-400' : 'text-slate-400'} /> 
                <span>Světlušky</span>
              </Link>
              {/* ODKAZ NA SOUHVĚZDÍ S IKONOU HVĚZDY */}
              <Link to="/souhvezdi" className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm transition mt-1 ${currentPath === '/souhvezdi' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'}`}>
                <Star size={14} className={currentPath === '/souhvezdi' ? 'text-amber-300' : 'text-slate-400'} /> 
                <span>Souhvězdí</span>
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
              <Lightbulb size={18} className={currentPath === '/hra' ? 'text-amber-400' : 'text-slate-400'} /> 
              <span>Světlušky</span>
            </Link>
            <Link to="/souhvezdi" onClick={closeMenu} className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition mt-1 ${currentPath === '/souhvezdi' ? 'bg-slate-800 text-amber-400 shadow-md' : 'text-slate-300'}`}>
              <Star size={18} className={currentPath === '/souhvezdi' ? 'text-amber-300' : 'text-slate-400'} /> 
              <span>Souhvězdí</span>
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
            <Route path="/:slug" element={<PohadkaDetail />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/60 text-slate-500 py-8 text-center text-xs mt-auto">
          <p>© {new Date().getFullYear()} Noční Knihovna. Všechna práva vyhrazena.</p>
          <p className="mt-1 text-slate-600">Čtené s láskou, kreslené a vybarvené ručně.</p>
        </footer>
      </div>
    </Router>
  );
}
