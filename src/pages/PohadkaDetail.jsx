import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Music, Download, CheckCircle } from 'lucide-react';

export default function PohadkaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState(localStorage.getItem('sl_passcode') || '');
  const [inputCode, setInputCode] = useState(passcode);
  const [codeSaved, setCodeSaved] = useState(false);

  const loadData = () => {
    setLoading(true);
    // Posíláme kód jako součást dotazu do API
    fetch(`/api/get-library?slug=${slug}&passcode=${passcode}`)
      .then(res => res.json())
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [slug, passcode]);

  const handleSaveCode = (e) => {
    e.preventDefault();
    localStorage.setItem('sl_passcode', inputCode.trim());
    setPasscode(inputCode.trim());
    setCodeSaved(true);
    setTimeout(() => setCodeSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p className="text-sm font-medium tracking-wide">Otevírám stránku knihovny...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-xl mb-4">Obsah nebyl nalezen 🌙</p>
        <Link to="/" className="text-amber-400 hover:underline">Zpět do knihovny</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
      <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-amber-400 transition group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
        <span>Zpět do knihovny</span>
      </Link>

      <div>
        <h2 className="text-4xl font-bold text-amber-400 mb-1">{item.title}</h2>
        {item.autor && <p className="text-slate-400 italic mb-3">Autor: {item.autor}</p>}
        <span className="inline-block bg-slate-800 text-amber-300 text-xs px-3 py-1 rounded-full font-medium">
          {item.type}
        </span>
      </div>

      {/* PRÉMIOVÝ PŘEHRÁVAČ AUDIO SOUBORU (MP3 Z NOTIONU) */}
      {item.isPremium && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
          {item.isUserVip ? (
            /* STAV: ODEMČENO (Uživatel je VIP člen)[cite: 1] */
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-400 font-semibold text-sm">
                <Music size={18} />
                <span>Prémiová autorská nahrávka je odemčena ✨</span>
              </div>
              <audio src={item.urlFile} controls className="w-full accent-amber-400 bg-slate-950 rounded-xl p-2" />
              
              {/* Pokud odkaz vede na PDF nebo obrázek omalovánky, nabídneme i tlačítko ke stažení */}
              {item.urlFile.includes('.pdf') || item.type === 'Říkadlo' ? (
                <a 
                  href={item.urlFile} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  <Download size={14} /> <span>Stáhnout omalovánku (PDF)</span>
                </a>
              ) : null}
            </div>
          ) : (
            /* STAV: UZAMČENO (Uživatel nemá kód nebo vypršel)[cite: 1] */
            <div className="text-center py-6 max-w-xl mx-auto space-y-4">
              <div className="inline-flex bg-amber-400/10 text-amber-400 p-3 rounded-full">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Hlasová nahrávka a omalovánky jsou uzamčeny</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tento bonusový obsah (nazpívaná písnička a PDF omalovánka ke stažení) je přístupný pouze pro naše stálé posluchače s aktivním VIP přístupem[cite: 1].
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Vložte svůj vygenerovaný Stripe Payment Link ze kroku 2 v dokumentu[cite: 1] */}
                <a 
                  href="https://buy.stripe.com/VA_STRIPE_LINK" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm transition shadow-lg hover:opacity-95"
                >
                  Aktivovat VIP přístup za 75 Kč ➔
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* YouTube přehrávač (pokud existuje) */}
      {item.youtubeId && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
          <iframe src={`https://www.youtube.com/embed/${item.youtubeId}`} title={item.title} className="w-full h-full" allowFullScreen></iframe>
        </div>
      )}

      {/* Spotify přehrávač (pokud existuje) */}
      {item.spotifyId && (
        <div>
          <iframe src={`https://open.spotify.com/embed/${item.spotifyId}`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-xl border border-slate-800"></iframe>
        </div>
      )}

      {/* Text příběhu z Notion */}
      {item.content && (
        <div className="prose prose-invert max-w-none bg-slate-900/40 p-6 md:p-10 rounded-2xl border border-slate-800/60 shadow-xl leading-relaxed text-slate-300 font-normal whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.content }} />
      )}

      {/* SPRÁVA KÓDU (Formulář na konci stránky pro změnu/přepsání kódu)[cite: 1] */}
      <div className="border-t border-slate-900 pt-8 max-w-md">
        <form onSubmit={handleSaveCode} className="bg-slate-900/20 border border-slate-800/80 p-4 rounded-xl space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
            🔑 Tvůj přístupový VIP kód
          </label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              placeholder="Zadej svůj kód (např. sl-novak-3x7p)..." 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button 
              type="submit" 
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-lg transition"
            >
              Uložit k름d
            </button>
          </div>
          {codeSaved && (
            <p className="text-emerald-400 text-[11px] flex items-center space-x-1">
              <CheckCircle size={12} /> <span>Kód byl uložen. Stránka se aktualizuje...</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
