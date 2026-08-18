import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Importy všech podstránek portálu
import Home from './pages/Home';
import Knihovna from './pages/Knihovna';
import AdhdGuide from './pages/AdhdGuide';
import Eshop from './pages/Eshop';
import ProduktDetail from './pages/ProduktDetail';
import Kosik from './pages/Kosik';
import PohadkaDetail from './pages/PohadkaDetail';
import Hadanky from './pages/Hadanky';
import Omalovanky from './pages/Omalovanky';
import Hra from './pages/Hra';
import Souhvezdi from './pages/Souhvezdi';
import Scrabble from './pages/Scrabble';
import Pexeso from './pages/Pexeso';
import Ovecky from './pages/Ovecky';
import Labyrint from './pages/Labyrint';
import VOP from './pages/VOP';
import GDPR from './pages/GDPR';
import Dekuji from './pages/Dekuji';

// Správa stavu košíku a ikony
import { CartProvider, useCart } from './CartContext';
import {
  Volume2,
  Baby,
  FileText,
  ShoppingBag,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  HelpCircle,
  Palette,
  Lightbulb,
  Star,
  LayoutGrid,
  Sparkles,
  Info,
  Type
} from 'lucide-react';

// BANNER PRO INFORMACE O COOKIES
function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('sl_cookies_confirmed_2026');
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sl_cookies_confirmed_2026', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-[#1A1D2F] border border-[#F8F6F0]/10 p-5 rounded-2xl shadow-2xl z-50 animate-fade-in backdrop-blur-md flex flex-col space-y-4">
      <div className="flex items-start space-x-3">
        <Info size={20} className="text-[#FFB703] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-[#F8F6F0] uppercase tracking-wide">Informace o souborech cookies</h5>
          <p className="text-[11px] text-[#F8F6F0]/70 leading-relaxed">
            Tento web používá nezbytné technické cookies pro správné fungování. Dále využíváme cookies třetích stran pro spuštění videí z <strong>YouTube</strong>, přehrávání hudby ze <strong>Spotify</strong> a pro doporučující odkazování.
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-3 items-center text-[10px]">
        <Link to="/gdpr" className="text-[#F8F6F0]/50 hover:text-[#F8F6F0] transition underline">Více informací</Link>
        <button onClick={handleAccept} className="bg-[#FFB703] hover:opacity-90 text-[#1A1D2F] font-extrabold text-xs px-5 py-2 rounded-xl transition cursor-pointer shadow-lg">
          Přijmout vše
        </button>
      </div>
    </div>
  );
}

// TLAČÍTKO KOŠÍKU (DESKTOP)
function CartButton() {
  const { totalCount } = useCart();
  const location = useLocation();
  const isActive = location.pathname === '/kosik';
  
  if (totalCount === 0) return null;

  return (
    <Link to="/kosik" className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${isActive ? 'bg-[#FFB703] text-[#1A1D2F]' : 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/30 hover:bg-[#FFB703]/30'}`}>
      <ShoppingCart size={14} />
      <span>Košík</span>
      <span className="bg-[#FFB703] text-[#1A1D2F] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black ml-0.5">
        {totalCount}
      </span>
    </Link>
  );
}

// TLAČÍTKO KOŠÍKU (MOBIL)
function CartButtonMobile({ closeMenu }) {
  const { totalCount } = useCart();
  if (totalCount === 0) return null;

  return (
    <Link to="/kosik" onClick={closeMenu} className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-[#FFB703]/10 text-[#FFB703] border border-[#FFB703]/20">
      <div className="flex items-center space-x-3">
        <ShoppingCart size={18} /> <span>Váš košík</span>
      </div>
      <span className="bg-[#FFB703] text-[#1A1D2F] text-xs px-2.5 py-0.5 rounded-full font-black">
        {totalCount}
      </span>
    </Link>
  );
}

// HLAVNÍ NAVIGAČNÍ HLAVIČKA
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const closeMenu = () => setIsMobileMenuOpen(false);

  const isKidsActive = ['/pro-deti', '/hadanky', '/omalovanky', '/hra', '/ovecky', '/souhvezdi', '/pexeso', '/labyrint', '/scrabble'].includes(currentPath);

  return (
    <header className="border-b border-[#F8F6F0]/10 bg-[#1A1D2F] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" onClick={closeMenu} className="flex items-center space-x-3 cursor-pointer">
          <span className="text-3xl">🌙</span>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-[#FFB703] uppercase">
              Noční Knihovna
            </h1>
            <p className="text-[11px] text-[#F8F6F0]/70">Tichý přístav pro zklidnění mysli</p>
          </div>
        </Link>

        {/* MOBILNÍ TLAČÍTKO */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-[#FFB703] hover:bg-[#F8F6F0]/5 rounded-xl transition" aria-label="Menu">
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* DESKTOP MENU (4 PILÍŘE) */}
        <nav className="hidden md:flex items-center space-x-2 bg-[#1A1D2F] p-1.5 rounded-full border border-[#F8F6F0]/10 text-xs uppercase tracking-wider font-semibold">
          
          {/* 1. AUDIO & PŘÍBĚHY */}
          <Link to="/audio" className={`px-4 py-2 rounded-full transition flex items-center space-x-1.5 ${currentPath === '/audio' ? 'bg-[#FFB703] text-[#1A1D2F] font-bold' : 'text-[#F8F6F0]/80 hover:text-[#F8F6F0]'}`}>
            <Volume2 size={14} /> <span>Audio & Příběhy</span>
          </Link>

          {/* 2. PRO DĚTI (DROPDOWN) */}
          <div className="relative group">
            <button className={`px-4 py-2 rounded-full transition flex items-center space-x-1.5 ${isKidsActive ? 'bg-[#FFB703] text-[#1A1D2F] font-bold' : 'text-[#F8F6F0]/80 hover:text-[#F8F6F0]'}`}>
              <Baby size={14} /> <span>Pro děti</span> <ChevronDown size={14} className="opacity-70 transition-transform group-hover:rotate-180" />
            </button>

            {/* Submenu pro děti */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-[#1A1D2F] border border-[#F8F6F0]/10 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left normal-case tracking-normal">
              <Link to="/pro-deti" className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#FFB703] font-bold hover:bg-[#F8F6F0]/5">
                <Baby size={14} /> <span>Přehled sekce Pro děti</span>
              </Link>
              <div className="border-t border-[#F8F6F0]/10 my-1 mx-2" />
              <Link to="/hadanky" className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs text-[#F8F6F0]/80 hover:text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <HelpCircle size={14} /> <span>Hádanky</span>
              </Link>
              <Link to="/omalovanky" className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs text-[#F8F6F0]/80 hover:text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <Palette size={14} /> <span>Omalovánky ke stažení</span>
              </Link>
              
              <div className="border-t border-[#F8F6F0]/10 my-1 mx-2" />
              <p className="text-[10px] font-bold text-[#F8F6F0]/40 uppercase px-3 py-1">Dětský hravý koutek</p>
              
              <Link to="/hra" className="flex items-center space-x-2 px-3 py-1 rounded-xl text-xs text-[#F8F6F0]/80 hover:text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <Lightbulb size={12} /> <span>Světlušky</span>
              </Link>
              <Link to="/ovecky" className="flex items-center space-x-2 px-3 py-1 rounded-xl text-xs text-[#F8F6F0]/80 hover:text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <span>🐑</span> <span>Počítání oveček</span>
              </Link>
              <Link to="/scrabble" className="flex items-center space-x-2 px-3 py-1 rounded-xl text-xs text-[#F8F6F0]/80 hover:text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <Type size={12} /> <span>Písmenka</span>
              </Link>
              <Link to="/souhvezdi" className="flex items-center space-x-2 px-3 py-1 rounded-xl text-xs text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <Star size={12} /> <span>Souhvězdí (Premium)</span>
              </Link>
              <Link to="/pexeso" className="flex items-center space-x-2 px-3 py-1 rounded-xl text-xs text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <LayoutGrid size={12} /> <span>Pexeso (Premium)</span>
              </Link>
              <Link to="/labyrint" className="flex items-center space-x-2 px-3 py-1 rounded-xl text-xs text-[#FFB703] hover:bg-[#F8F6F0]/5">
                <Star size={12} /> <span>Labyrint (Premium)</span>
              </Link>

              <div className="border-t border-[#F8F6F0]/10 my-1 mx-2" />
              <a href="https://generator.nocniknihovna.cz" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#2EC4B6] hover:bg-[#F8F6F0]/5">
                <Sparkles size={14} /> <span>Generátor pohádek</span>
              </a>
            </div>
          </div>

          {/* 3. ADHD PRŮVODCE */}
          <Link to="/adhd-pruvodce" className={`px-4 py-2 rounded-full transition flex items-center space-x-1.5 ${currentPath === '/adhd-pruvodce' ? 'bg-[#FFB703] text-[#1A1D2F] font-bold' : 'text-[#FFB703] font-bold hover:opacity-80'}`}>
            <FileText size={14} /> <span>ADHD Průvodce (Zdarma)</span>
          </Link>

          {/* 4. E-SHOP */}
          <Link to="/eshop" className={`px-4 py-2 rounded-full transition flex items-center space-x-1.5 ${currentPath === '/eshop' ? 'bg-[#FFB703] text-[#1A1D2F] font-bold' : 'text-[#F8F6F0]/80 hover:text-[#F8F6F0]'}`}>
            <ShoppingBag size={14} /> <span>E-shop</span>
          </Link>

          <CartButton />
        </nav>
      </div>

      {/* MOBILNÍ ROZBALOVACÍ MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#1A1D2F] border-b border-[#F8F6F0]/10 px-4 py-6 flex flex-col space-y-3 shadow-2xl z-50 animate-fade-in max-h-[calc(100vh-80px)] overflow-y-auto">
          <CartButtonMobile closeMenu={closeMenu} />

          <Link to="/audio" onClick={closeMenu} className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${currentPath === '/audio' ? 'bg-[#FFB703]/20 text-[#FFB703] font-bold' : 'text-[#F8F6F0]/80'}`}>
            <Volume2 size={18} /> <span>Audio & Příběhy</span>
          </Link>

          <div className="bg-[#1A1D2F] rounded-2xl p-3 border border-[#F8F6F0]/10 space-y-1">
            <Link to="/pro-deti" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-bold text-[#FFB703]">
              <Baby size={18} /> <span>Pro děti (Přehled)</span>
            </Link>
            <div className="border-t border-[#F8F6F0]/10 my-1" />
            <Link to="/hadanky" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1.5 rounded-xl text-xs text-[#F8F6F0]/80"><HelpCircle size={14} /> <span>Hádanky</span></Link>
            <Link to="/omalovanky" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1.5 rounded-xl text-xs text-[#F8F6F0]/80"><Palette size={14} /> <span>Omalovánky</span></Link>
            <p className="text-[10px] font-bold text-[#F8F6F0]/40 uppercase tracking-widest pt-2 pb-1 pl-3">Dětský hravý koutek</p>
            <Link to="/hra" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1 rounded-xl text-xs text-[#F8F6F0]/80"><Lightbulb size={14} /> <span>Světlušky</span></Link>
            <Link to="/ovecky" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1 rounded-xl text-xs text-[#F8F6F0]/80"><span>🐑</span> <span>Počítání oveček</span></Link>
            <Link to="/scrabble" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1 rounded-xl text-xs text-[#F8F6F0]/80"><Type size={14} /> <span>Písmenka</span></Link>
            <Link to="/souhvezdi" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1 rounded-xl text-xs text-[#FFB703]"><Star size={14} /> <span>Souhvězdí (Premium)</span></Link>
            <Link to="/pexeso" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1 rounded-xl text-xs text-[#FFB703]"><LayoutGrid size={14} /> <span>Pexeso (Premium)</span></Link>
            <Link to="/labyrint" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-1 rounded-xl text-xs text-[#FFB703]"><Star size={14} /> <span>Labyrint (Premium)</span></Link>
          </div>

          <Link to="/adhd-pruvodce" onClick={closeMenu} className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition ${currentPath === '/adhd-pruvodce' ? 'bg-[#FFB703]/20 text-[#FFB703]' : 'bg-[#FFB703]/10 text-[#FFB703] border border-[#FFB703]/30'}`}>
            <FileText size={18} /> <span>ADHD Průvodce (Zdarma)</span>
          </Link>

          <Link to="/eshop" onClick={closeMenu} className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${currentPath === '/eshop' ? 'bg-[#FFB703]/20 text-[#FFB703] font-bold' : 'text-[#F8F6F0]/80'}`}>
            <ShoppingBag size={18} /> <span>E-shop</span>
          </Link>

          <a href="https://generator.nocniknihovna.cz" target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2EC4B6] border border-[#F8F6F0]/10 bg-[#1A1D2F]">
            <Sparkles size={18} /> <span>Generátor pohádek na míru</span>
          </a>
        </div>
      )}
    </header>
  );
}

// MAIN APP & ROUTING
export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen text-[#F8F6F0] selection:bg-[#FFB703]/30 selection:text-[#FFB703] flex flex-col bg-[#1A1D2F]">
          <Header />
          
          <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
            <Routes>
              {/* Hlavní úvodní stránka */}
              <Route path="/" element={<Home />} />

              {/* 4 hlavních pilíře */}
              <Route path="/audio" element={<Knihovna />} />
              <Route path="/pro-deti" element={<Knihovna />} />
              <Route path="/adhd-pruvodce" element={<AdhdGuide />} />

              {/* Podstránky */}
              <Route path="/eshop" element={<Eshop />} />
              <Route path="/eshop/:slug" element={<ProduktDetail />} />
              <Route path="/kosik" element={<Kosik />} />
              <Route path="/hadanky" element={<Hadanky />} />
              <Route path="/omalovanky" element={<Omalovanky />} />
              <Route path="/hra" element={<Hra />} />
              <Route path="/ovecky" element={<Ovecky />} />
              <Route path="/souhvezdi" element={<Souhvezdi />} />
              <Route path="/scrabble" element={<Scrabble />} />
              <Route path="/pexeso" element={<Pexeso />} />
              <Route path="/labyrint" element={<Labyrint />} />
              <Route path="/obchodni-podminky" element={<VOP />} />
              <Route path="/gdpr" element={<GDPR />} />
              <Route path="/dekuji" element={<Dekuji />} />
              <Route path="/:slug" element={<PohadkaDetail />} />
            </Routes>
          </main>
          
          {/* ZÁPATÍ S PŘESNÝMI BARVAMI */}
          <footer className="border-t border-[#F8F6F0]/10 bg-[#1A1D2F] text-[#F8F6F0]/70 py-10 text-center text-xs mt-auto px-4 space-y-6">
            <div className="space-y-1.5">
              <p className="text-[#F8F6F0]/90 font-medium">© {new Date().getFullYear()} Noční Knihovna. Všechna práva vyhrazená.</p>
              <p className="text-[#F8F6F0]/60 max-w-2xl mx-auto leading-relaxed">
                Veškeré nahrávky pro Vás zaznamenávám svým vlastním hlasem. Ilustrace jsou spoluvytvářené s pomocí AI a mnou ručně graficky upravené.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F8F6F0]/10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F8F6F0]/70">
              <div className="text-center sm:text-left space-y-0.5">
                <p className="font-semibold text-[#F8F6F0]">Provozovatel: Jitka Pekárková</p>
                <p>Sídlo: Primátorská 38, Praha 8 • IČO: 87458021</p>
                <p>Fyzická osoba zapsaná v živnostenském rejstříku.</p>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-end gap-x-3 gap-y-2 font-medium">
                <a href="https://jitkap.cz" target="_blank" rel="noopener noreferrer" className="text-[#FFB703] hover:underline">O autorce</a>
                <span className="text-[#F8F6F0]/30">•</span>
                <a href="https://navigator40k.cz" target="_blank" rel="noopener noreferrer" className="text-[#2EC4B6] hover:underline">Navigátor 40k</a>
                <span className="text-[#F8F6F0]/30 hidden sm:inline">•</span>
                <Link to="/obchodni-podminky" className="hover:text-[#F8F6F0] transition">Obchodní podmínky</Link>
                <span className="text-[#F8F6F0]/30">•</span>
                <Link to="/gdpr" className="hover:text-[#F8F6F0] transition">GDPR</Link>
              </div>
            </div>
          </footer>

          <CookieBar />
        </div>
      </Router>
    </CartProvider>
  );
}
