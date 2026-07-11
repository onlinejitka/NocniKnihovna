import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Knihovna from './pages/Knihovna';
import PohadkaDetail from './pages/PohadkaDetail';
import Hadanky from './pages/Hadanky';
import Omalovanky from './pages/Omalovanky';
import Hra from './pages/Hra';
import Souhvezdi from './pages/Souhvezdi'; // Import nové hry souhvězdí
import { BookOpen, HelpCircle, Sparkles, Palette, Sparkle, Star } from 'lucide-react';

// Komponenta navigačního menu v hlavičce webu
function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <nav className="flex items-center space-x-1 md:space-x-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
      
      {/* 1. Odkaz: Knihovna */}
      <Link 
        to="/"
        className={`px-2.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <BookOpen size={14} /> <span className="hidden sm:inline">Knihovna</span>
      </Link>
      
      {/* 2. Odkaz: Hádanky */}
      <Link 
        to="/hadanky"
        className={`px-2.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/hadanky' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <HelpCircle size={14} /> <span className="hidden sm:inline">Hádanky</span>
      </Link>

      {/* 3. Odkaz: Omalovánky */}
      <Link 
        to="/omalovanky"
        className={`px-2.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/omalovanky' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <Palette size={14} /> <span className="hidden sm:inline">Omalovánky</span>
      </Link>

      {/* 4. Odkaz: Světlušky */}
      <Link 
        to="/hra"
        className={`px-2.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/hra' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <Sparkle size={14} className="text-amber-400" /> <span className="hidden sm:inline">Světlušky</span>
      </Link>

      {/* 5. Odkaz: Souhvězdí (Novinka) */}
      <Link 
        to="/souhvezdi"
        className={`px-2.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${currentPath === '/souhvezdi' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <Star size={13} className="text-amber-300 animate-pulse" /> <span>Souhvězdí</span>
      </Link>

      {/* 6. Externí odkaz: Generátor pohádek na subdoméně */}
      <a 
        href="https://generator.nocniknihovna.cz"
        target="_blank"
        rel="noopener noreferrer"
        className="px-2.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 group"
      >
        <Sparkles size={14} className="text-indigo-400 group-hover:animate-pulse" /> 
        <span>Generátor</span>
      </a>
    </nav>
  );
}

// Hlavní obal aplikace a směrování stránek (Routing)
export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
        
        {/* Společná fixní hlavička pro celý web */}
        <header className="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 cursor-pointer">
              <span className="text-3xl">🌙</span>
              <div>
                <h1 className="text-xl font-bold tracking-wide text-amber-400">Noční Knihovna</h1>
                <p className="text-xs text-slate-400">Klidné usínání plné příběhů</p>
              </div>
            </Link>
            
            <Navigation />
          </div>
        </header>

        {/* Místo, kam se dynamicky nahrává obsah podle toho, na jaké stránce zrovna jste */}
        <main className="max-w-6xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Knihovna />} />
            <Route path="/hadanky" element={<Hadanky />} />
            <Route path="/omalovanky" element={<Omalovanky />} />
            <Route path="/hra" element={<Hra />} />
            <Route path="/souhvezdi" element={<Souhvezdi />} /> {/* Nová cesta pro souhvězdí */}
            <Route path="/:slug" element={<PohadkaDetail />} />
          </Routes>
        </main>

        {/* Společná patička s vykráním */}
        <footer className="border-t border-slate-900 mt-20 bg-slate-950/60 text-slate-500 py-8 text-center text-xs">
          <p>© {new Date().getFullYear()} Noční Knihovna. Všechna práva variavována.</p>
          <p className="mt-1 text-slate-600">Čtené s láskou, kreslené a vybarvené ručně.</p>
        </footer>

      </div>
    </Router>
  );
}
