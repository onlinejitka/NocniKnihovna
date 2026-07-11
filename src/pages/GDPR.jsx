import React from 'react';

export default function GDPR() {
  return (
    <div className="max-w-3xl mx-auto bg-slate-900/30 border border-slate-800 p-6 md:p-10 rounded-3xl space-y-6 text-slate-300 text-sm leading-relaxed animate-fade-in">
      <h2 className="text-2xl font-serif font-bold text-amber-400 border-b border-slate-800 pb-3">
        Ochrana osobních údajů (GDPR)
      </h2>
      
      <p>
        Správcem osobních údajů je <strong>Jitka Pekárková</strong>, IČO: 87458021, se sídlem Primátorská 38, Praha 8. Tyto zásady popisují, jak nakládám s Vašimi údaji na webu <strong>nocniknihovna.cz</strong> v souvislosti s předplatným a integrovanými službami.
      </p>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">1. Účel a rozsah zpracování osobních údajů</h3>
        <p>
          Při registraci a správě měsíčního předplatného zpracovávám Váš <strong>e-mail</strong> a nezbytné transakční údaje. Tyto údaje slouží výhradně pro plnění smlouvy (generování přístupového kódu přes Make.com, vedení aktivního členství v databázi Notion a párování slev na fyzické produkty). Platební údaje (čísla karet) zpracovává přímo a bezpečně pouze certifikovaná brána Stripe.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">2. Soubory cookies a třetí strany</h3>
        <p>
          Tento web využívá pokročilé funkce třetích stran, které mohou do Vašeho prohlížeče ukládat své vlastní cookies za účelem správného zobrazení obsahu a měření statistik:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>YouTube</strong> (pro přehrávání a náhledy videí pohádek a vybarvování)</li>
          <li><strong>Spotify</strong> (pro přehrávání integrovaného audia a písniček)</li>
          <li><strong>Alza.cz</strong> (pro správné fungování doporučujících affiliate bannerů a odkazů)</li>
        </ul>
        <p>
          Ukládání těchto cookies můžete kdykoliv ovlivnit nastavením své cookie lišty na tomto webu nebo přímo ve svém internetovém prohlížeči.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">3. Vaše práva</h3>
        <p>
          Jako zákazník máte plné právo požadovat přehled o svých zpracovávaných údajích, žádat jejich úpravu, nebo se na mě obrátit s požadavkem na úplné zrušení předplatného a smazání e-mailu z mých systémů. V případě dotazů mě můžete kontaktovat přes kontakty na mém profesním webu <strong>jitkap.cz</strong>.
        </p>
      </section>
    </div>
  );
}
