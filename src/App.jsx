import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Knihovna from './pages/Knihovna';
import PohadkaDetail from './pages/PohadkaDetail';
import Hadanky from './pages/Hadanky';
import { BookOpen, HelpCircle } from 'lucide-react';

// Pomocná komponenta pro svítící tlačítka v menu podle toho, kde se zrovna nacházíte
function Navigation() {
  const location = useLocation();
  const isHadanky = location.pathname === '/hadanky';
  
  return (
    <nav class="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
      <Link 
        to="/"
        class={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${!isHadanky ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <BookOpen size={14} /> <span>Knihovna</span>
      </Link>
      <Link 
        to="/hadanky"
        class={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition flex items-center space-x-1.5 ${isHadanky ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <HelpCircle size={14} /> <span>Hádanky</span>
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div class="min-h-screen text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
        
        {/* Společná hlavička */}
        <header class="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur sticky top-0 z-50">
          <div class="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link to="/" class="flex items-center space-x-3 cursor-pointer">
              <span class="text-3xl">🌙</span>
              <div>
                <h1 class="text-xl font-bold tracking-wide text-amber-400">Noční Knihovna</h1>
                <p class="text-xs text-slate-400">Klidné usínání plné příběhů</p>
              </div>
            </Link>
            
            <Navigation />
          </div>
        </header>

        {/* Dynamický obsah stránek */}
        <main class="max-w-6xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Knihovna />} />
            <Route path="/hadanky" element={<Hadanky />} />
            <Route path="/:slug" element={<PohadkaDetail />} />
          </Routes>
        </main>

        {/* Společná patička */}
        <footer class="border-t border-slate-900 mt-20 bg-slate-950/60 text-slate-500 py-8 text-center text-xs">
          <p>© {new Date().getFullYear()} Noční Knihovna. Všechna práva vyhrazena.</p>
          <p class="mt-1 text-slate-600">Čtené s láskou, kreslené ručně.</p>
        </footer>

      </div>
    </Router>
  );
}
