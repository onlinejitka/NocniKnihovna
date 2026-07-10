import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Music, Download, CheckCircle, Play } from 'lucide-react';

export default function PohadkaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState(localStorage.getItem('sl_passcode') || '');
  const [inputCode, setInputCode] = useState(passcode);
  const [codeSaved, setCodeSaved] = useState(false);

  const loadData = () => {
    setLoading(true);
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

      {/* BLOK S PRÉMIOVÝM OBSAHEM (AUDIO / OMALOVÁNKA) */}
      {item.isPremium && (
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          
          {item.isUserVip ? (
            /* =======================================================
               STAV 1: ODEMČENO (Uživatel má platný VIP kód)
               ======================================================= */
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>VIP obsah úspěšně odemčen ✨</span>
              </div>
              
              {/* Skutečný funkční přehrávač souboru */}
              <audio src={item.urlFile} controls className="w-full accent-amber-400 bg-slate-950 rounded-xl p-2" />
              
              {/* Tlačítko pro stažení reálného souboru (PDF/Obrázek) */}
              <div className="pt-2">
                <a 
                  href={item.urlFile} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow"
                >
                  <Download size={14} /> <span>Stáhnout omalovánku k vytištění (PDF)</span>
                </a>
              </div>
            </div>
          ) : (
            /* =======================================================
               STAV 2: UZAMČENO (Ukázka přehrávače a tlačítka jako teaser)
               ======================================================= */
            <div className="space-y-6">
              
              {/* Vizuální maketa audio přehrávače */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                  Hlasová nahrávka na dobrou noc
                </span>
                <div className="w-full bg-slate-950/60 rounded-xl p-3 flex items-center space-x-4 border border-slate-900 select-none opacity-40">
                  <div className="bg-slate-800 p-2 rounded-full text-slate-500">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1/12 bg-amber-500/40 rounded-full"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">0:00 / --:--</span>
                  <Lock size={14} className="text-amber-500/60 shrink-0" />
                </div>
              </div>

              {/* Vizuální maketa tlačítka pro stažení omalovánky */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                  Materiály pro tvořivé ručičky
                </span>
                <div>
                  <div className="inline-flex items-center space-x-2 bg-slate-950/40 border border-slate-900 text-slate-500 text-xs font-bold px-4 py-2.5 rounded-xl select-none opacity-40">
                    <Download size={14} /> 
                    <span>Stáhnout bonusovou omalovánku v PDF</span>
                    <Lock size={12} className="ml-1 text-amber-500/60" />
                  </div>
                </div>
              </div>

              {/* Stylový prodejní banner pod maketami */}
              <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-amber-500/5 to-transparent p-4 rounded-xl border border-amber-500/10">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                    <Lock size={14} className="text-amber-400" />
                    <span>Chceš dětem odemknout nahrávku i omalovánku?</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Aktivací VIP členství získáte okamžitý přístup k nazpívaným písničkám, prémiovým omalovánkám ke stažení a neomezenému AI generátoru pohádek.
                  </p>
                </div>
                <div className="shrink-0">
                  {/* Nezapomeňte sem vložit váš reálný Stripe Payment Link z administrace */}
                  <a 
                    href="https://buy.stripe.com/VA_STRIPE_LINK" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full md:w-auto inline-block text-center bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition shadow-lg hover:shadow-orange-500/5 hover:opacity-95"
                  >
                    Aktivovat přístup za 75 Kč ➔
                  </a>
                </div>
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

      {/* FORMULÁŘ PRO ZADÁNÍ / PŘEPSÁNÍ VIP KÓDU */}
      <div className="border-t border-slate-900 pt-8 max-w-md">
        <form onSubmit={handleSaveCode} className="bg-slate-900/20 border border-slate-800/80 p-4 rounded-xl space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
            🔑 Už máš svůj VIP přístupový kód?
          </label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              placeholder="Vlož kód z e-mailu (např. sl-jiri-8x3a)..." 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button 
              type="submit" 
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-lg transition shrink-0"
            >
              Uložit kód
            </button>
          </div>
          {codeSaved && (
            <p className="text-emerald-400 text-[11px] flex items-center space-x-1 animate-pulse">
              <CheckCircle size={12} /> <span>Kód uložen! Aktualizuji pohádku...</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
