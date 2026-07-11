import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

export default function PohadkaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCode = localStorage.getItem('sl_passcode') || '';
    setLoading(true);
    
    fetch(`/api/get-library?slug=${slug}&passcode=${savedCode}`)
      .then(res => {
        if (!res.ok) throw new Error('Nepodařilo se načíst detail příběhu.');
        return res.json();
      })
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p className="text-sm font-medium">Rozsvěcím čtecí lampičku...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
        <p className="text-slate-300 font-medium">Příběh se nepodařilo otevřít.</p>
        <Link to="/" className="text-amber-400 text-xs font-bold hover:underline">➔ Zpět do knihovny</Link>
      </div>
    );
  }

  // ROZHODOVACÍ LOGIKA PRO AFFILIATE BANNER
  // Pokud v Notionu u pohádky nic nevyplníte, nasadí se tato univerzální lampička
  const finalAffiliateUrl = item.affiliateUrl || "https://www.alza.cz/kod/HRAbz14725"; 
  const finalAffiliateText = item.affiliateText || "Pro dokonalou snovou atmosféru v pokojíčku využíváme při večerním čtení toto uklidňující projektové světýlko, které si děti zamilovaly.";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Tlačítko zpět */}
      <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition">
        <ArrowLeft size={14} /> <span>Zpět do knihovny</span>
      </Link>

      {/* Titulek */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-amber-400/80 uppercase tracking-widest bg-amber-400/5 px-2.5 py-1 rounded-md border border-amber-400/10">{item.type}</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-100 pt-2">{item.title}</h2>
        {item.autor && <p className="text-sm text-slate-400 italic">Napsal/a: {item.autor}</p>}
      </div>

      {/* MULTIMEDIÁLNÍ INTEGRACE (YouTube / Spotify) */}
      <div className="grid grid-cols-1 gap-4">
        {item.youtubeId && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <iframe 
              src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0`}
              title={`Noční Knihovna - ${item.title}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {item.spotifyId && (
          <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
            <iframe 
              src={`https://open.spotify.com/embed/${item.spotifyId}`}
              width="100%" 
              height="152" 
              allow="encrypted-media" 
              title="Spotify přehrávač"
              className="border-none"
            />
          </div>
        )}
      </div>

      {/* TEXT POHÁDKY */}
      {item.content ? (
        <div 
          className="bg-slate-900/20 border border-slate-900 p-6 md:p-8 rounded-2xl font-serif text-slate-200 text-lg leading-relaxed space-y-4 shadow-sm"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      ) : (
        <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl text-center text-slate-500 text-sm italic">
          Textová verze k tomuto motivu se připravuje. Pusťte si zatím audio nebo video výše.
        </div>
      )}

      {/* INTEGROVANÝ ELEGANTNÍ AFFILIATE BANNER */}
      <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/40 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full filter blur-xl group-hover:bg-amber-400/10 transition duration-500" />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
            <Sparkles size={10} /> <span>Tip z naší knihovny</span>
          </span>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
            {finalAffiliateText}
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto self-center">
          <a 
            href={finalAffiliateUrl.startsWith('http') ? finalAffiliateUrl : `https://${finalAffiliateUrl}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md"
          >
            <ShoppingBag size={13} />
            <span>Zobrazit doporučené</span>
          </a>
        </div>
      </div>

      {/* Odkaz na omalovánky na konci */}
      <div className="pt-4 flex justify-center border-t border-slate-900">
        <Link 
          to="/omalovanky" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400/90 hover:text-amber-400 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition shadow-sm"
        >
          <span>Chci stáhnout omalovánku k tomuto motivu</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
