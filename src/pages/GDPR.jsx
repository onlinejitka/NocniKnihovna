import React from 'react';

export default function GDPR() {
  return (
    <div className="max-w-3xl mx-auto bg-slate-900/30 border border-slate-800 p-6 md:p-10 rounded-3xl space-y-6 text-slate-300 text-sm leading-relaxed animate-fade-in">
      <h2 className="text-2xl font-serif font-bold text-amber-400 border-b border-slate-800 pb-3">
        Ochrana osobních údajů (GDPR)
      </h2>
      
      <p>
        Správcem osobních údajů je <strong>Jitka Pekárková</strong>, IČO: 87458021, se sídlem Primátorská 38, Praha 8. Ochrana Vašeho soukromí a osobních údajů Vašich dětí je pro mě naprostou prioritou.
      </p>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">1. Jaké údaje sbírám a proč?</h3>
        <p>
          Při zakoupení Premium členství zpracovávám pouze Váš <strong>e-mail</strong>. Tento údaj je nezbytný pro splnění smlouvy – konkrétně pro vygenerování a bezpečné zaslání Vašeho přístupového kódu. Bez zadání e-mailu nelze nákup technicky dokončit.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">2. Kdo má k údajům přístup?</h3>
        <p>
          Vaše e-maily nikomu neprodávám ani je nepoužívám pro nevyžádaný marketing. Pro zajištění chodu nákupního procesu je však předávám těmto spolehlivým zpracovatelům:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Stripe</strong> (zabezpečená platební brána zpracovávající samotnou platbu)</li>
          <li><strong>Make.com</strong> (automatizační služba, která propojí platbu se zasláním e-mailu)</li>
          <li><strong>Notion</strong> (interní zabezpečená databáze, kde jsou uloženy aktivní přístupové kódy)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">3. Doba uchování a Vaše práva</h3>
        <p>
          Údaje spojené s Premium členstvím uchovávám po dobu platnosti Vašeho přístupu. Podle nařízení GDPR máte plné právo požadovat informaci, jaké údaje zpracovávám, vyžádat si jejich opravu, nebo mě kontaktovat s žádostí o úplné smazání Vašeho kódu i e-mailu z databáze.
        </p>
      </section>
    </div>
  );
}
