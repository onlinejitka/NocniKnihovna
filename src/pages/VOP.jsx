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
          Tyto všeobecné obchodní podmínky platí pro nákup opakovaného měsíčního prémiového přístupu (Premium členství a připravované VIP členství) na webové stránce <strong>Noční Knihovna (nocniknihovna.cz)</strong>.
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
        <h3 className="font-bold text-slate-100 text-base">2. Předmět smlouvy, předplatné a výhody</h3>
        <p>
          Předmětem smlouvy je poskytování digitálního obsahu formou <strong>opakovaného měsíčního předplatného</strong>. Aktivací členství získává zákazník přístup k prémiovým funkcím webu (rozšířené omalovánky, hlasové nahrávky, prémiové hry a AI generátor pohádek).
        </p>
        <p><strong>Garantované slevy na připravované fyzické produkty:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Aktivní <strong>Premium členství</strong> garantuje zákazníkovi <strong>slevu 10%</strong> na nákup našich fyzických produktů.</li>
          <li>Aktivní <strong>VIP členství</strong> (v tuto chvíli v přípravě) bude zákazníkovi garantovat <strong>slevu 15%</strong> na nákup našich fyzických produktů.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">3. Platební mechanismus a zrušení předplatného</h3>
        <p>
          Platba předplatného probíhá automaticky každý měsíc prostřednictvím platební brány <strong>Stripe</strong>, která bezpečně uchovává platební údaje. Poplatek za členství (75 Kč / měsíc u tarifu Premium) je stržen vždy k odpovídajícímu dni v měsíci. 
        </p>
        <p>
          Zákazník má plné právo své měsíční předplatné <strong>kdykoliv zrušit</strong>. Zrušení lze provést jednoduše kontaktováním provozovatelky, případně přes odkaz ve Stripe rozhraní. Po zrušení zůstává přístup aktivní do konce již zaplaceného zúčtovacího období, poté zaniká.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">4. Odstoupení od smlouvy</h3>
        <p>
          Zákazník bere na vědomí, že u digitálního obsahu poskytovaného online dochází k jeho plnému zpřístupnění ihned po dokončení objednávky. Z tohoto důvodu <strong>nelze uplatnit 14denní lhůtu pro odstoupení od smlouvy bez udání důvodu</strong> na již započatý a zaplacený měsíc (v souladu s § 1837 písm. l) občanského zákoníku ČR). Každé další opakování platby však může zákazník včasným zrušením předplatného stopnout.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-slate-100 text-base">5. Reklamace a podpora</h3>
        <p>
          V případě jakýchkoliv technických potíží, nefunkčnosti přístupového kódu nebo dotazů k platbám mě kontaktujte na e-mailu dostupném na mé profesní doméně <strong>jitkap.cz</strong>. Tyto aktualizované podmínky jsou platné od 11. 7. 2026.
        </p>
      </section>
    </div>
  );
}
