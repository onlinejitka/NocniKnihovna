import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, Download, Palette, Music, BookOpen } from 'lucide-react'; // OPRAVA: Music místo Music4

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
        if (!res.ok) throw new Error('Nepodařilo se načíst detail.');
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

  const isSong = item.type === 'Písnička';
  
  const defaultUrl = isSong 
    ? "https://www.alza.cz/hracky/detske-hudebni-nastroje/18851214.htm"
    : "https://www.alza.cz/media/knihy-pro-deti/18856641.htm";

  const defaultText = isSong
    ? "Jemné tóny a melodie pomáhají zklidnit dětskou mysl před spánkem. Prozkoumejte náš výběr dětských hudebních nástrojů a dřevěných zvonkoher ideálních pro večerní rituály."
    : "Chcete rozvíjet dětskou představivost i mimo obrazovku? Vybrali jsme pro Vás ty nejkrásnější tištěné pohádkové knížky pro společné chvíle a klidné čtení v postýlce.";

  const finalAffiliateUrl = item.affiliateUrl || defaultUrl; 
  const finalAffiliateText = item.affiliateText || defaultText;
  const finalAffiliateImage = item.affiliateImage || "";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition">
        <ArrowLeft size={14} /> <span>Zpět do knihovny</span>
      </Link>

      <div className="space-y-1">
        <span className="text-xs font-bold text-amber-400/80 uppercase tracking-widest bg-amber-400/5 px-2.5 py-1 rounded-md border border-amber-400/10">{item.type}</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-100 pt-2">{item.title}</h2>
        {item.autor && <p className="text-sm text-slate-400 italic">Napsal/a: {item.autor}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {item.youtubeId && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0`} title={item.title} className="absolute inset-0 w-full h-full" allowFullScreen />
          </div>
        )}
        {item.spotifyId && (
          <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
            <iframe src={`https://open.spotify.com/embed/${item.spotifyId}`} width="100%" height="152" allow="encrypted-media" title="Spotify" className="border-none" />
          </div>
        )}
      </div>

      {item.urlOmalovankyHlavni && (
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-lg">
          <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 shadow-inner relative group">
            <div className="w-10 h-12 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center shadow-md rotate-3 group-hover:rotate-6 transition-transform">
              <Palette size={16} className="text-slate-500" />
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
              <Download size={10} strokeWidth={3} />
            </div>
          </div>
          
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h4 className="text-sm font-bold text-slate-200 tracking-wide">Hlavní omalovánka k vytisknutí</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Černobílá kreativní šablona ve vysokém rozlišení. Ideální pro vybarvování během poslechu příběhu.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <a href={item.urlOmalovankyHlavni} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md">
              <Download size={13} strokeWidth={2.5} />
              <span>Stáhnout PDF zdarma</span>
            </a>
          </div>
        </div>
      )}

      {item.content ? (
        <div className="bg-slate-900/20 border border-slate-900 p-6 md:p-8 rounded-2xl font-serif text-slate-200 text-lg leading-relaxed space-y-4 shadow-sm" dangerouslySetInnerHTML={{ __html: item.content }} />
      ) : (
        <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl text-center text-slate-500 text-sm italic">
          Textová verze se připravuje. Pusťte si zatím audio nebo video výše.
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
          <div className="w-24 h-24 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner relative p-1 bg-gradient-to-b from-slate-900 to-slate-950">
            {finalAffiliateImage ? (
              <img src={finalAffiliateImage} alt="Produkt" className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-slate-900/40 rounded-lg flex items-center justify-center text-amber-400/40">
                {isSong ? <Music size={24} /> : <BookOpen size={24} />}
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
          <a href={finalAffiliateUrl.startsWith('http') ? finalAffiliateUrl : `https://${finalAffiliateUrl}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md group-hover:border-amber-400/30">
            <ShoppingBag size={13} />
            <span>Zobrazit nabídku</span>
          </a>
        </div>
      </div>

      <div className="pt-2 flex justify-center">
        <Link to="/omalovanky" className="inline-flex items-center space-x-2 text-[11px] font-medium text-slate-500 hover:text-slate-400 transition">
          <span>Chcete vidět i ostatní omalovánky v galerii? Prohlédnout vše</span>
          <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}
