import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Download, Lock, Palette, CheckCircle } from 'lucide-react';

const TYPE_LABELS = {
  'Pohádka': 'Pohádka',
  'Říkadlo': 'Říkadlo',
  'Písnička': 'Písnička'
};

export default function Omalovanky() {
  const [sheets, setSheets] = useState([]);
  const [isUserVip, setIsUserVip] = useState(false); // Sledování, zda je návštěvník Premium člene[cite: 1]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funkce pro otevření Stripe platby v centrovaném vnořeném okně
  const openStripePopup = (e) => {
    if (e) e.preventDefault();
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

  useEffect(() => {
    const savedCode = localStorage.getItem('sl_passcode') || '';
    setLoading(true);
    
    fetch(`/api/get-library?passcode=${savedCode}`)
      .then(async res => {
        if (!res.ok) throw new Error('Nepodařilo se načíst knihovnu pro omalovánky.');
        return res.json();
      })
      .then(data => {
        if (data) {
          setIsUserVip(data.isUserVip); // Uložíme informaci o stavu členství[cite: 1]
          
          if (Array.isArray(data.items)) {
            const allSheets = [];

            data.items.forEach(item => {
              // 1. Hlavní omalovánka (Vždy zdarma pro všechny)
              if (item.urlOmalovankyHlavni) {
                allSheets.push({
                  id: `${item.id}-hlavni`,
                  title: item.title,
                  slug: item.slug,
                  type: item.type,
                  imageUrl: item.urlOmalovankyHlavni,
                  downloadUrl: item.urlOmalovankyHlavni,
                  isPremium: false
                });
              }

              // 2. Prémiové omalovánky (Přístupné ke stažení pouze pro Premium členy)[cite: 1]
              if (item.premiumImages && item.premiumImages.length > 0) {
                item.premiumImages.forEach((imgUrl, index) => {
                  // Určíme správný chráněný odkaz na stažení na základě indexu
                  let secureDownloadUrl = '';
                  if (data.isUserVip) {
                    if (index === 0) secureDownloadUrl = item.urlOmalovanky01;
                    if (index === 1) secureDownloadUrl = item.urlOmalovanky02;
                    if (index === 2) secureDownloadUrl = item.urlOmalovanky03;
                  }

                  allSheets.push({
                    id: `${item.id}-premium-${index}`,
                    title: item.title,
                    slug: item.slug,
                    type: item.type,
                    imageUrl: imgUrl,             // Veřejný náhled obrázku
                    downloadUrl: secureDownloadUrl, // Odkaz ke stažení (plný nebo prázdný podle ověření)[cite: 1]
                    isPremium: true,
                    label: `Prémiový list 0${index + 1}`
                  });
                });
              }
            });

            setSheets(allSheets);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Obsluha kliknutí na tlačítko stažení
  const handleDownloadClick = (e, sheet) => {
    // Pokud je obsah prémiový a uživatel nemá přístup (downloadUrl je prázdná), vyvoláme platbu[cite: 1]
    if (sheet.isPremium && !sheet.downloadUrl) {
      e.preventDefault();
      openStripePopup();
    }
    // V opačném případě se provede standardní otevření odkazu (stažení souboru)
  };

  return (
    <div className="space-y-10">
      {/* Hlavička stránky s vykáním */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Velká galerie omalovánek
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Prohlédněte si všechny kreativní listy k našim pohádkám, písničkám a říkadlům. Základní omalovánky jsou k dispozici zcela zdarma, rozšířené sady pak čekají na naše Premium členy.
        </p>
      </div>

      {/* DYNAMICKÝ PREMIUM BANNER PRO NÁKUP ČLENSTVÍ POD ÚVODNÍM TEXTEM */}
      <div className="max-w-4xl mx-auto">
        {isUserVip ? (
          /* Stav: Uživatel již má aktivované členství */
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-2xl flex items-center justify-center space-x-3 shadow-md">
            <CheckCircle className="text-emerald-400 shrink-0" size={20} />
            <span className="text-sm font-semibold text-slate-200">
              Vaše Premium členství je aktivní. Všechny omalovánky i audio nahrávky máte plně odemčené. Děkujeme Vám za podporu! ✨
            </span>
          </div>
        ) : (
          /* Stav: Uživatel nemá aktivované členství – Zobrazení prodejní nabídky */
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-5 md:p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-xl">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                <Palette size={18} className="text-amber-400" />
                <span>Odemkněte si kompletní sadu Premium kreativních listů</span>
              </h4>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Aktivací Premium členství získáte okamžitý přístup ke všem rozšířeným omalovánkám (3 listy ke každému motivu), doprovodným hlasovým nahrávkám písniček i říkadel a našemu inteligentnímu AI generátoru pohádek na míru.
              </p>
            </div>
            <div className="shrink-0">
              <button 
                onClick={openStripePopup}
                className="w-full md:w-auto inline-block text-center bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wide transition shadow-lg hover:shadow-orange-500/5 hover:opacity-95 cursor-pointer"
              >
                Aktivovat Premium za 75 Kč ➔
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STAV: NAČÍTÁNÍ */}
      {loading && (
        <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium tracking-wide">Připravuji malířská plátna a pastelky...</p>
        </div>
      )}

      {/* STAV: CHYBA */}
      {!loading && error && (
        <div className="max-w-xl mx-auto bg-red-950/30 border border-red-500/30 p-6 rounded-2xl text-center space-y-3">
          <div className="inline-flex text-red-400"><AlertTriangle size={32} /></div>
          <h4 className="text-lg font-bold text-red-200">Chyba při načítání galerie</h4>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      )}

      {/* STAV: PRÁZDNO */}
      {!loading && !error && sheets.length === 0 && (
        <div className="max-w-xl mx-auto bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center text-slate-400">
          <p className="text-sm font-medium">V databázi momentálně nejsou nahrané žádné omalovánky.</p>
        </div>
      )}

      {/* STAV: ZOBRAZENÍ GALERIE */}
      {!loading && !error && sheets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {sheets.map(sheet => (
            <div 
              key={sheet.id}
              className="group bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition"
            >
              {/* Náhledový obrázek v poměru 4:3 */}
              <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden border-b border-slate-900 select-none">
                <img 
                  src={sheet.imageUrl} 
                  alt={`Omalovánka - ${sheet.title}`} 
                  className={`w-full h-full object-cover transition duration-300 group-hover:scale-102 ${
                    sheet.isPremium && !sheet.downloadUrl ? 'opacity-25 filter blur-[0.5px]' : 'opacity-85'
                  }`}
                />
                
                {sheet.isPremium && !sheet.downloadUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={16} className="text-amber-400 bg-slate-950/80 p-1.5 w-8 h-8 rounded-full border border-slate-800 shadow" />
                  </div>
                )}

                <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  sheet.isPremium && !sheet.downloadUrl
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : sheet.isPremium && sheet.downloadUrl
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {sheet.isPremium ? 'Premium' : 'Zdarma'}
                </span>
              </div>

              {/* Spodní textový obsah karty */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {TYPE_LABELS[sheet.type] || 'Obsah'} {sheet.label ? `• ${sheet.label}` : ''}
                  </span>
                  
                  <Link 
                    to={`/${sheet.slug}`}
                    className="text-sm font-bold text-slate-200 hover:text-amber-400 transition line-clamp-2 block leading-snug"
                  >
                    {sheet.title}
                  </Link>
                </div>

                {/* AKČNÍ TLAČÍTKO: Stažení souboru nebo vyvolání platby[cite: 1] */}
                <div className="pt-2 border-t border-slate-900">
                  <a 
                    href={sheet.downloadUrl || '#'} 
                    target={sheet.downloadUrl ? "_blank" : "_self"}
                    rel="noreferrer"
                    onClick={(e) => handleDownloadClick(e, sheet)}
                    className={`w-full inline-flex items-center justify-center space-x-1.5 font-bold py-2 rounded-xl text-xs transition ${
                      sheet.isPremium && !sheet.downloadUrl
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-400/90'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    <Download size={12} />
                    <span>
                      {sheet.isPremium && !sheet.downloadUrl ? 'Odemknout a stáhnout 🔒' : 'Stáhnout omalovánku'}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
