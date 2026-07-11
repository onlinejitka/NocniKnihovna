import React from 'react';

export default function VOP() {
  return (
    <div className="max-w-3xl mx-auto bg-slate-900/30 border border-slate-800 p-6 md:p-10 rounded-3xl space-y-6 text-slate-300 text-sm leading-relaxed animate-fade-in">
      <h2 className="text-2xl font-serif font-bold text-amber-400 border-b border-slate-800 pb-3">
        Všeobecné obchodní podmínky (VOP)
      </h2>
      
      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">1. Úvodní ustanovení</h3>
        <p>
          Tyto všeobecné obchodní podmínky platí pro nákup prémiového přístupu (Premium členství) na webové stránce <strong>Noční Knihovna (nocniknihovna.cz)</strong>. 
        </p>
        <p>
          Provozovatelem a poskytovatelem digitálního obsahu je:<br />
          <strong>Jitka Pekárková</strong><br />
          Sídlo: Primátorská 38, Praha 8<br />
          IČO: 87458021<br />
          Fyzická osoba zapsaná v živnostenském rejstříku.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">2. Předmět smlouvy a digitální obsah</h3>
        <p>
          Předmětem koupě je poskytnutí digitálního obsahu – jednorázové aktivace Premium přístupu ke sady rozšířených omalovánek, hlasovým nahrávkám a doplňkovým interaktivním hrám na webu nocniknihovna.cz. Cena za tento přístup je pevně stanovena na 75 Kč.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">3. Platební podmínky a doručení</h3>
        <p>
          Platba probíhá bezpečně online prostřednictvím platební brány <strong>Stripe</strong>. Ihned po úspěšném dokončení platby je zákazníkovi automaticky vygenerován a na jím zadanou e-mailovou adresu odeslán unikátní přístupový kód (za technické podpory platformy Make.com). Vložením tohoto kódu na webu dojde k okamžitému odemčení obsahu.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">4. Odstoupení od smlouvy (Důležité)</h3>
        <p>
          Vzhledem k tomu, že se jedná o dodání <strong>digitálního obsahu online</strong>, který je zákazníkovi zpřístupněn ihned po zaplacení, zákazník výslovně souhlasí s tím, že <strong>nemá právo na odstoupení od smlouvy do 14 dnů bez udání důvodu</strong> (v souladu s § 1837 písm. l) občanského zákoníku ČR). Digitální produkt je považován za zkonzumovaný v momentě doručení a aktivace kódu.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">5. Reklamace a závěrečná ustanovení</h3>
        <p>
          V případě technických potíží s doručením kódu nebo nefunkčností webového rozhraní může zákazník kontaktovat provozovatelku na e-mailu přidruženém k profesní doméně jitkap.cz. Tyto podmínky jsou platné a účinné od 11. 7. 2026.
        </p>
      </section>
    </div>
  );
}
