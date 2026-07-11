{/* KOPÍRUJTE TENTO BLOK BANNERU A VLOŽTE JEJ NA KONEC SOUBORU OMALOVANKY.JSX PŘED POSLEDNÍ </div> */}
<div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group mt-16 max-w-4xl mx-auto">
  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/10 transition duration-500" />
  <div className="flex flex-col sm:flex-row items-center gap-5 flex-1">
    <div className="w-20 h-20 bg-slate-950 border border-slate-800/60 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-gradient-to-b from-slate-900 to-slate-950 text-amber-400/40">
      <Palette size={24} />
    </div>
    <div className="space-y-1.5 text-center sm:text-left">
      <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-widest bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10 inline-flex items-center space-x-1">
        <Sparkles size={10} /> <span>Doporučení pro tisk a tvorbu</span>
      </span>
      <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
        Pro dokonalý kreativní zážitek doporučujeme kvalitní trojhranné pastelky s měkkou tuhou, které se dětem skvěle drží, nebo spolehlivé domácí tiskárny pro čistý a rychlý tisk našich snových šablon.
      </p>
    </div>
  </div>
  <div className="shrink-0 w-full sm:w-auto self-center">
    <a href="https://www.alza.cz/hracky/pastelky/18857283.htm" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shadow-md">
      <ShoppingBag size={13} />
      <span>Zobrazit na Alze</span>
    </a>
  </div>
</div>
