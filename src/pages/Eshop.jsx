import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Download, Lock, Plus, Check, Crown, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';

export default function Eshop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [inputEmail, setInputEmail] = useState('');

  // Načteme z paměti košíku stav Premium členství i funkci pro uložení e-mailu
  const { cartItems, addToCart, isVip: isPremium, vipEmail: premiumEmail, setVipEmail: setPremiumEmail } = useCart();

  useEffect(() => {
    fetch('/api/get-products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Aktivace Premium slevy přímo v obchůdku
  const handleApplyPremium = (e) => {
    e.preventDefault();
    if (inputEmail.trim()) {
      setPremiumEmail(inputEmail.trim().toLowerCase());
    }
  };

  // Koupit hned (přímá platba za tento 1 kus)
  const handleBuyNow = async (product) => {
    setBuyingId(product.id);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id,
          vipEmail: premiumEmail || inputEmail
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Chyba při vytváření platby.');
        setBuyingId(null);
      }
    } catch (err) {
      console.error(err);
      alert('Chyba brány.');
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4">
      
      {/* Hlavička obchůdku */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Pohádkový Obchůdek
        </h2>
        
        {/* UPRAVENÝ PODTITULEK */}
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          Pořiďte si tvořivé a výukové balíčky pro své děti nebo si rovnou aktivujte Premium členství pro slevu 10% a přístup ke všem omalovánkám, hrám, audio obsahu, i generátoru pohádek.
        </p>

        {/* SEKCÍ PREMIUM ČLENSTVÍ */}
        {isPremium ? (
          /* Zobrazení pro již aktivované členy */
          <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-5 py-2.5 rounded-full text-xs font-bold animate-fade-in shadow-lg">
            <Crown size={16} className="text-emerald-400" />
            <span>Máte aktivní Premium členství – na všechny produkty platí 10% sleva!</span>
            <button 
              onClick={() => { setPremiumEmail(''); setInputEmail(''); }} 
              className="text-[10px] text-slate-400 hover:text-slate-200 underline ml-2 cursor-pointer"
              title="Odhlásit kód"
            >
              (změnit)
            </button>
          </div>
        ) : (
          /* Zobrazení formuláře pro neaktivované nebo nepřihlášené */
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-5 text-left max-w-xl mx-auto shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs md:text-sm">
              <Crown size={16} className="text-amber-400" />
              <span>Jste Premium členem Noční Knihovny?</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zadejte e-mail, pod kterým máte aktivní Premium členství, a aktivujte si 10% slevu na všechny balíčky.
            </p>
            <form onSubmit={handleApplyPremium} className="flex gap-2">
              <input
                type="email"
                placeholder="Váš Premium e-mail..."
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 flex-grow focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer shrink-0 shadow-md"
              >
                Uplatnit slevu
              </button>
            </form>
            <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-800/60">
              <span>Nemáte ještě Premium členství?</span>
              <Link to="/omalovanky" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
                <span>Aktivovat Premium za 75 Kč</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* NABÍDKA PRODUKTŮ */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Načítám nabídku obchůdku...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const inCart = cartItems.some(i => i.id === product.id);
            const originalPrice = Number(product.price) || 0;
            const discountedPrice = Math.round(originalPrice * 0.9);

            return (
              <div key={product.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/40 transition shadow-xl">
                
                {/* ODKAZ NA DETAIL PRODUKTU */}
                <Link to={`/eshop/${product.slug}`} className="space-y-4 group cursor-pointer block">
                  <div className="aspect-video w-full bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800/80">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-400/30">
                        <ShoppingBag size={40} />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
                      {product.type === 'VIP' || product.type === 'Premium' ? <Lock size={10} /> : <Download size={10} />}
                      {product.type === 'VIP' || product.type === 'Premium' ? 'Premium Přístup' : 'PDF ke stažení'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition">{product.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{product.description}</p>
                  </div>
                </Link>

                <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    
                    {/* CENA (PŘEŠKRTNUTÁ PRO PREMIUM ČLENY) */}
                    <div>
                      {isPremium ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-emerald-400">{discountedPrice} Kč</span>
                          <span className="text-xs text-slate-500 line-through font-bold">{originalPrice} Kč</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-black text-amber-300">{originalPrice} Kč</span>
                      )}
                    </div>

                    {/* Tlačítko Přidat do košíku */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={inCart}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        inCart 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                      title="Přidat do košíku"
                    >
                      {inCart ? (
                        <>
                          <Check size={14} />
                          <span>V košíku</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Do košíku</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tlačítko Koupit hned */}
                  <button
                    onClick={() => handleBuyNow(product)}
                    disabled={buyingId === product.id}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {buyingId === product.id ? 'Příprava platby...' : 'Koupit hned'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
