import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, Download, BookOpen, Lock, Play, CheckCircle, Music } from 'lucide-react';

const AUDIO_TYPE_LABELS = {
  'Pohádka': 'Hlasová nahrávka pohádky',
  'Říkadlo': 'Hlasová nahrávka říkadla',
  'Písnička': 'Hlasová nahrávka písničky'
};

export default function PohadkaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Premium stavy
  const [passcode, setPasscode] = useState(localStorage.getItem('sl_passcode') || '');
  const [inputCode, setInputCode] = useState(passcode);
  const [codeSaved, setCodeSaved] = useState(false);
  const [audioDuration, setAudioDuration] = useState('--:--');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/get-library?slug=${slug}&passcode=${passcode}`)
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
  }, [slug, passcode]);

  const handleSaveCode = (e) => {
    e.preventDefault();
    localStorage.setItem('sl_passcode', inputCode.trim());
    setPasscode(inputCode.trim());
    setCodeSaved(true);
    setTimeout(() => setCodeSaved(false), 3000);
  };

  const openStripePopup = (e) => {
    e.preventDefault();
    const url = "https://buy.stripe.com/8x2fZh8CZ2H2eD73aQ9IQ0q";
    const width = 500;
    const height = 710;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      url, 
      'StripePremiumCheckout', 
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

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

  // Affiliate proměnné
  const isSong = item.type === 'Písnička';
  const defaultUrl = isSong 
    ? "https://www.alza.cz/hracky/hudebni-nastroje-pro-deti/18857266.htm?idp=23293" 
    : "https://www.alza.cz/media/knihy-pro-deti/18856641.htm";
  const defaultText = isSong
    ? "Jemné tóny a melodie pomáhají zklidnit dětskou mysl před spánkem. Prozkoumejte náš výběr dětských hudebních nástrojů a dřevěných zvonkoher ideálních pro večerní rituály."
    : "Vybrali jsme pro Vás ty nejkrásnější tištěné pohádkové knížky pro společné chvíle a klidné čtení v postýlce.";
  const finalAffiliateUrl = item.affiliateUrl || defaultUrl; 
  const finalAffiliateText = item.affiliateText || defaultText;
  const finalAffiliateImage = item.affiliateImage || "";

  // Helper pro premium obrázky z DB (kombinuje případný array s jednotlivými url z Notion)
  const premiumImages = item.premiumImages || [item.urlOmalovanky01, item.urlOmalovanky02, item.urlOmalovanky03].filter(Boolean);
  const hasPremiumOmalovanky = premiumImages.length > 0;
  const hasAudio = !!item.urlAudio;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Skrytý audio přehrávač pro získání délky stopy pro zamčený stav */}
      {hasAudio && (
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

      <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition">
        <ArrowLeft size={14} /> <span>Zpět do knihovny</span>
      </Link>

      <div className="space-y-1">
        <span className="text-xs font-bold text-amber-400/80 uppercase tracking-widest bg-amber-400/5 px-2.5 py-1 rounded-md border border-amber-400/10">{item.type}</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-100 pt-2">{item.title}</h2>
        {item.autor && <p className="text-sm text-slate-400 italic">Napsal/a: {item.autor}</p>}
      </div>

      {/* --- PREMIUM BOX (ZAMČENO / ODEMČENO) --- */}
      {(hasAudio || hasPremiumOmalovanky) && (
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          
          {item.isUserVip ? (
            /* STAV: ODEMČENO (VIP) */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Premium obsah úspěšně odemčen ✨</span>
              </div>
              
              {hasAudio && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    {AUDIO_TYPE_LABELS[item.type] || 'Hlasová nahrávka'}
                  </span>
                  <audio src={item.urlAudio} controls className="w-full accent-amber-400 bg-slate-950 rounded-xl p-2" />
                </div>
              )}

              {hasPremiumOmalovanky && (
                <div className="space-y-4 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    Rozšířené Premium omalovánky v balíčku
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {premiumImages.map((imgUrl, index) => (
                      <div key={index} className="flex flex-col space-y-2">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                          <img src={imgUrl} alt={`Omalovánka ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <a href={imgUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold py-2 rounded-lg transition">
                          <Download size={12} /> <span>Stáhnout</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STAV: UZAMČENO (PŘESNĚ DLE SCREENSHOTU) */
            <div className="space-y-6">
              
              {hasAudio && (
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
                    <span className="text-xs font-mono text-slate-500">0:00 / {audioDuration}</span>
                    <Lock size={14} className="text-amber-500/60 shrink-0" />
                  </div>
                </div>
              )}

              {hasPremiumOmalovanky && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                    Rozšířené Premium omalovánky (Sada {premiumImages.length} listů)
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {premiumImages.map((imgUrl, idx) => (
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

              {/* Stripe Výzva */}
              <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-amber-500/5 to-transparent p-4 rounded-xl border border-amber-500/10">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                    <Lock size={14} className="text-amber-400" />
                    <span>Chcete dětem odemknout nahrávku a celou sadu omalovánek?</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Aktivací Premium členství získáte okamžitý přístup k doprovodným nahrávkám, rozšířeným kreativním sadám ke stažení a našemu inteligentnímu AI generátoru pohádek na míru.
                  </p>
                </div>
                <div className="shrink-0">
                  <button 
                    onClick={openStripePopup}
                    className="w-full md:w-auto inline-block text-center bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition shadow-lg hover:shadow-orange-500/5 hover:opacity-95 cursor-pointer"
                  >
                    Aktivovat přístup za 75 Kč ➔
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* --- KONEC PREMIUM BOXU --- */}

      {/* Multimédia a Hlavní Omalovánka ZDARMA (Pokud existují) */}
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
          <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-inner relative">
            <img 
              src={item.urlOmalovankyHlavni} 
              alt="Náhled omalovánky" 
              className="w-full h-full object-cover filter brightness-90 contrast-105" 
            />
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h4 className="text-sm font-bold text-slate-200 tracking-wide">Hlavní omalovánka k vytisknutí</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Kreativní šablona připravená ke stažení. Ideální pro vybarvování během poslechu příběhu.
            </p>
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <a href={item.urlOmalovankyHlavni} download target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md">
              <Download size={13} strokeWidth={2.5} />
              <span>Uložit obrázek (PNG)</span>
            </a>
          </div>
        </div>
      )}

      {/* TEXT POHÁDKY / PÍSNIČKY */}
      {item.content ? (
        <div className="bg-slate-900/20 border border-slate-900 p-6 md:p-8 rounded-2xl font-serif text-slate-200 text-lg leading-relaxed space-y-4 shadow-sm" dangerouslySetInnerHTML={{ __html: item.content }} />
      ) : (
        <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl text-center text-slate-500 text-sm italic">
          Textová verze se připravuje. Pusťte si zatím audio nebo video výše.
        </div>
      )}

      {/* AFFILIATE BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500 pointer-events-none" />
        
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
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
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

      <div className="pt-2 flex justify-center border-b border-slate-900/50 pb-8">
        <Link to="/omalovanky" className="inline-flex items-center space-x-2 text-[11px] font-medium text-slate-500 hover:text-slate-400 transition">
          <span>Chcete vidět i ostatní omalovánky v galerii? Prohlédnout vše</span>
          <ArrowRight size={10} />
        </Link>
      </div>

      {/* FORMULÁŘ PRO ZADÁNÍ PREMIUM KÓDU (Pro ty, kteří už mají zaplaceno, ale vypršela jim session) */}
      <div className="max-w-md mx-auto pt-4">
        <form onSubmit={handleSaveCode} className="bg-slate-900/20 border border-slate-800/80 p-4 rounded-xl space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center sm:text-left">
            🔑 Už máte svůj Premium přístupový kód?
          </label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              placeholder="Vložte kód z e-mailu..." 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button 
              type="submit" 
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-lg transition shrink-0"
            >
              Odemknout
            </button>
          </div>
          {codeSaved && (
            <p className="text-emerald-400 text-[11px] flex items-center justify-center sm:justify-start space-x-1 animate-pulse pt-1">
              <CheckCircle size={12} /> <span>Kód uložen! Obsah se odemyká...</span>
            </p>
          )}
        </form>
      </div>

    </div>
  );
}
