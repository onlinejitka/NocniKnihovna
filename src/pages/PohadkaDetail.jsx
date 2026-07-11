import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, Download, Palette } from 'lucide-react';

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
  const finalAffiliateUrl = item.affiliateUrl || "https://www.alza.cz/kod/HRAbz14725"; 
  const finalAffiliateText = item.affiliateText || "Pro dokonalou snovou atmosféru v pokojíčku využíváme při večerním čtení toto uklidňující projektové světýlko, které si děti zamilovaly.";
  const finalAffiliateImage = item.affiliateImage || ""; // Zde se propíše obrázek z Notion, pokud existuje

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

      {/* OPRAVENO: SEKCE PRO STAŽENÍ OMALOVÁNKY JE NYNÍ S NÁHLEDEM A UMÍSTĚNA NAD TEXTEM */}
      {item.urlOmalovankyHlavni && (
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-lg">
          {/* Grafický miniaturní náhled omalovánky */}
          <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center group shadow-inner">
            {item.thumbnail ? (
              <img src={item.thumbnail} alt="Náhled omalovánky" className="w-full h-full object-cover opacity-40 filter grayscale contrast-125" />
            ) : (
              <Palette size={24} className="text-slate-700" />
            )}
            <div className="absolute inset-0 bg-slate-950/20" />
            <div className="absolute w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-amber-400">
              <Palette size={14} />
            </div>
          </div>
          
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <h4 className="text-sm font-bold text-slate-200 tracking-wide">Hlavní omalovánka k tomuto motivu</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Stáhněte si černobílou šablonu ve vysokém rozlišení pro tisk. Děti mohou vybarvovat společně s naším videem.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <a 
              href={item.urlOmalovankyHlavni} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md"
            >
              <Download size={13} strokeWidth={2.5} />
              <span>Stáhnout PDF zdarma</span>
            </a>
          </div>
        </div>
      )}

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

      {/* OPRAVENO: NOVÝ ELEGANTNÍ GRAFICKÝ AFFILIATE BANNER S PRODUKTOVOU FOTOGRAFIÍ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
          {/* Grafický slot pro náhled produktu */}
          <div className="w-24 h-24 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner relative p-1 bg-gradient-to-b from-slate-900 to-slate-950">
            {finalAffiliateImage ? (
              <img 
                src={finalAffiliateImage} 
                alt="Doporučený produkt" 
                className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full bg-slate-900/40 rounded-lg flex items-center justify-center">
                <ShoppingBag size={24} className="text-slate-700 group-hover:text-amber-500/40 transition-colors duration-500" />
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
              <Sparkles size={10} /> <span>Tip z naší knihovny</span>
            </span>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-lg">
              {finalAffiliateText}
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto self-center">
          <a 
            href={finalAffiliateUrl.startsWith('http') ? finalAffiliateUrl : `https://${finalAffiliateUrl}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md group-hover:border-amber-400/30"
          >
            <ShoppingBag size={13} />
            <span>Zobrazit na e-shopu</span>
          </a>
        </div>
      </div>

      {/* Odkaz na omalovánky na úplném konci jako sekundární navigace */}
      <div className="pt-2 flex justify-center">
        <Link 
          to="/omalovanky" 
          className="inline-flex items-center space-x-2 text-[11px] font-medium text-slate-500 hover:text-slate-400 transition"
        >
          <span>Chcete vidět i ostatní omalovánky v galerii? Prohlédnout vše</span>
          <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}
