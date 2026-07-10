import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Music, Download, CheckCircle, Play } from 'lucide-react';

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
  
  // Stav pro dynamické uložení reálné délky audia
  const [audioDuration, setAudioDuration] = useState('--:--');

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
      
      {/* Skrytý audio element sloužící výhradně k načtení reálné stopáže z Notion souboru[cite: 1] */}
      {item.hasAudio && item.urlAudio && (
        <audio 
          src={item.urlAudio} 
          preload="metadata" 
          onLoadedMetadata={(e) => {
            const mins = Math.floor(e.target.duration / 60);
            const secs = Math.floor(e.target.duration % 60).toString().padStart(2, '0');
            setAudioDuration(`${mins}:${secs}`);
          }}
          className="hidden"
        />
      )}

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

      {/* SEKCE 1: OMALOVÁNKA ZDARMA */}
      {item.urlOmalovankyHlavni && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <span>🎁</span> <span>Hlavní omalovánka ke stažení zdarma</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tento základní kreslicí list k motivu „{item.title}“ si můžete ihned stáhnout a vytisknout.
            </p>
          </div>
          <div className="shrink-0">
            <a 
              href={item.urlOmalovankyHlavni} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-5 py-3 rounded-xl transition shadow-md"
            >
              <Download size={14} /> <span>Stáhnout zdarma (PDF)</span>
            </a>
          </div>
        </div>
      )}

      {/* SEKCE 2: VIP BOX (Zobrazí se POUZE pokud existuje audio nebo prémiové omalovánky) */}
      {(item.hasAudio || item.hasPremiumOmalovanky) && (
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          
          {item.isUserVip ? (
            /* ========================== STAV: ODEMČENO ========================== */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>VIP balíček úspěšně odemčen ✨</span>
              </div>
              
              {item.hasAudio && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    {AUDIO_TYPE_LABELS[item.type] || 'Hlasová nahrávka'}
                  </span>
                  <audio src={item.urlAudio} controls className="w-full accent-amber-400 bg-slate-950 rounded-xl p-2" />
                </div>
              )}

              {item.hasPremiumOmalovanky && (
                <div className="space-y-4 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    Rozšířené prémiové omalovánky v balíčku
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { url: item.urlOmalovanky01, label: 'Omalovánka 01' },
                      { url: item.urlOmalovanky02, label: 'Omalovánka 02' },
                      { url: item.urlOmalovanky03, label: 'Omalovánka 03' }
                    ].filter(o => o.url).map((omalovanka, index) => (
                      <div key={index} className="flex flex-col space-y-2">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                          <img src={omalovanka.url} alt={omalovanka.label} className="w-full h-full object-cover" />
                        </div>
                        <a href={omalovanka.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold py-2 rounded-lg transition">
                          <Download size={12} /> <span>Stáhnout</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ========================== STAV: UZAMČENO ========================== */
            <div className="space-y-6">
              
              {/* Audio se vykreslí POUZE pokud reálně v Notion existuje[cite: 1] */}
              {item.hasAudio && (
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
                    {/* NOVINKA: Zde se vypisuje reálně načtená stopáž souboru[cite: 1] */}
                    <span className="text-xs font-mono text-slate-500">0:00 / {audioDuration}</span>
                    <Lock size={14} className="text-amber-500/60 shrink-0" />
                  </div>
                </div>
              )}

              {/* Omalovánky se vykreslí POUZE pokud reálně v Notion existují[cite: 1] */}
              {item.hasPremiumOmalovanky && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                    Rozšířené prémiové omalovánky (Sada {item.premiumImages.length} listů)
                  </span>
                  
                  {/* NOVINKA: Mřížka zobrazující VŠECHNY dostupné omalovánky v dokonalém poměru 4:3[cite: 1] */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {item.premiumImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-900 bg-slate-950/50 select-none">
                        <img 
                          src={imgUrl} 
                          alt="Náhled prémiového listu" 
                          className="w-full h-full object-cover opacity-20 filter blur-[0.5px]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                          <Lock size={18} className="text-amber-400/80 bg-slate-950/80 p-1 rounded-full border border-slate-800 shadow" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <div className="inline-flex items-center space-x-2 bg-slate-950/40 border border-slate-900 text-slate-500 text-xs font-bold px-4 py-2.5 rounded-xl select-none opacity-40">
                      <Download size={14} /> 
                      <span>Stáhnout bonusové omalovánky v PDF</span>
                      <Lock size={12} className="ml-1 text-amber-500/60" />
                    </div>
                  </div>
                </div>
              )}

              {/* Prodejní banner */}
              <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-amber-500/5 to-transparent p-4 rounded-xl border border-amber-500/10">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                    <Lock size={14} className="text-amber-400" />
                    <span>Chceš dětem odemknout nahrávku a celou sadu omalovánek?</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Aktivací VIP členství získáte okamžitý přístup k doprovodným nahrávkám, rozšířeným kreativním sadám ke stažení a našemu inteligentnímu AI generátoru pohádek na míru.
                  </p>
                </div>
                <div className="shrink-0">
                  <a 
                    href="https://buy.stripe.com/8x2fZh8CZ2H2eD73aQ9IQ0q" 
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

      {/* YouTube přehrávač */}
      {item.youtubeId && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
          <iframe src={`https://www.youtube.com/embed/${item.youtubeId}`} title={item.title} className="w-full h-full" allowFullScreen></iframe>
        </div>
      )}

      {/* Spotify přehrávač */}
      {item.spotifyId && (
        <div>
          <iframe src={`https://open.spotify.com/embed/${item.spotifyId}`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-xl border border-slate-800"></iframe>
        </div>
      )}

      {/* Zrcadlově přesný text z Notion */}
      {item.content && (
        <div className="prose prose-invert max-w-none bg-slate-900/40 p-6 md:p-10 rounded-2xl border border-slate-800/60 shadow-xl leading-relaxed text-slate-300 font-normal whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.content }} />
      )}

      {/* FORMULÁŘ PRO VIP KÓD */}
      <div className="border-t border-slate-900 pt-8 max-w-md">
        <form onSubmit={handleSaveCode} className="bg-slate-900/20 border border-slate-800/80 p-4 rounded-xl space-y-3">
          <label className="block className-text-[11px] font-bold uppercase tracking-widest text-slate-400">
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
              <CheckCircle size={12} /> <span>Kód uložen! Aktualizuji stránku...</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
