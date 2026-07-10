import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Music, Download, CheckCircle, Play, Image } from 'lucide-react';

// Slovník pro správné české skloňování dynamických popisků audio přehrávače[cite: 1]
const AUDIO_TYPE_LABELS = {
  'Pohádka': 'Hlasová nahrávka pohádky',
  'Říkadlo': 'Hlasová nahrávka říkadla',
  'Písnička': 'Hlasová nahrávka písničky'
};

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

      {/* BLOK S PRÉMIOVÝM OBSAHEM */}
      {item.isPremium && (
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          
          {item.isUserVip ? (
            /* =======================================================
               STAV 1: ODEMČENO (Aktivní VIP přístup)
               ======================================================= */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>VIP obsah úspěšně odemčen ✨</span>
              </div>
              
              {/* Audio přehrávač */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  {AUDIO_TYPE_LABELS[item.type] || 'Hlasová nahrávka'}
                </span>
                <audio src={item.urlFile} controls className="w-full accent-amber-400 bg-slate-950 rounded-xl p-2" />
              </div>

              {/* Zobrazení reálného náhledu odemčené omalovánky a tlačítka */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Omalovánka k vytištění
                </span>
                {item.omalovankaPreview && (
                  <div className="max-w-xs rounded-xl overflow-hidden border border-slate-800 shadow-md bg-slate-950">
                    <img src={item.omalovankaPreview} alt="Náhled omalovánky" className="w-full h-auto object-contain" />
                  </div>
                )}
                <div>
                  <a 
                    href={item.urlFile} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow"
                  >
                    <Download size={14} className="text-amber-400" /> <span>Stáhnout omalovánku (PDF / Obrázek)</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* =======================================================
               STAV 2: UZAMČENO (S reálnými náhledy a dynamickými texty)
               ======================================================= */
            <div className="space-y-6">
              
              {/* Dynamická maketa audio přehrávače */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                  {AUDIO_TYPE_LABELS[item.type] || 'Hlasová nahrávka'}
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

              {/* NOVINKA: Reálný zamčený náhled omalovánkového listu z Notion[cite: 1] */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                  Materiály pro tvořivé ručičky (Omalovánka)
                </span>
                <div className="relative max-w-xs rounded-xl overflow-hidden border border-slate-900 bg-slate-950/50 group select-none">
                  {item.omalovankaPreview ? (
                    /* Zobrazení reálného obrázku s poloprůhledným filtrem a ochranným vodoznakem[cite: 1] */
                    <div className="relative aspect-[3/4] w-full bg-slate-900">
                      <img 
                        src={item.omalovankaPreview} 
                        alt="Náhled omalovánky k odemčení" 
                        className="w-full h-full object-cover opacity-25 filter blur-[1px]"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-950/30">
                        <Lock size={28} className="text-amber-500/80 bg-slate-950/80 p-1.5 rounded-full border border-slate-800 mb-2 shadow" />
                        <span className="text-[10px] font-bold uppercase text-amber-400/80 tracking-widest bg-slate-950/80 px-2 py-1 rounded-md border border-slate-900">VIP bonus</span>
                      </div>
                    </div>
                  ) : (
                    /* Elegantní obrázkový placeholder, pokud ještě náhled v Notion není vyplněný[cite: 1] */
                    <div className="aspect-video w-full flex flex-col items-center justify-center p-6 text-center text-slate-600 opacity-40 border border-dashed border-slate-800 rounded-xl bg-slate-950">
                      <Image size={24} className="mb-2" />
                      <span className="text-xs font-medium">Omalovánkový list k tomuto obsahu</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-1">
                  <div className="inline-flex items-center space-x-2 bg-slate-950/40 border border-slate-900 text-slate-500 text-xs font-bold px-4 py-2.5 rounded-xl select-none opacity-40">
                    <Download size={14} /> 
                    <span>Stáhnout bonusovou omalovánku v PDF</span>
                    <Lock size={12} className="ml-1 text-amber-500/60" />
                  </div>
                </div>
              </div>

              {/* Prodejní banner */}
              <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-amber-500/5 to-transparent p-4 rounded-xl border border-amber-500/10">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                    <Lock size={14} className="text-amber-400" />
                    <span>Chceš dětem odemknout nahrávku i omalovánku?</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Aktivací VIP členství získáte okamžitý přístup k nazpívaným písničkám, prémiovým omalovánkám ke stažení a neomezenému AI generátoru pohádek[cite: 1].
                  </p>
                </div>
                <div className="shrink-0">
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

      {/* Zrcadlově přesný text z Notion */}
      {item.content && (
        <div className="prose prose-invert max-w-none bg-slate-900/40 p-6 md:p-10 rounded-2xl border border-slate-800/60 shadow-xl leading-relaxed text-slate-300 font-normal whitespace-pre-wrap animate-fade-in" dangerouslySetInnerHTML={{ __html: item.content }} />
      )}

      {/* FORMULÁŘ PRO ZADÁNÍ VIP KÓDU */}
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
