import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Download, Lock, Plus, Check, Crown } from 'lucide-react';
import { useCart } from '../CartContext';

export default function Eshop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  // Načteme z paměti košíku i stav VIP a e-mail
  const { cartItems, addToCart, isVip, vipEmail } = useCart();

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

  // Koupit hned (přímá platba za tento 1 kus)
  const handleBuyNow = async (product) => {
    setBuyingId(product.id);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id,
          vipEmail: vipEmail // Posíláme VIP e-mail i při přímém nákupu!
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
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Pohádkový Obchůdek
        </h2>
        <p className="text-slate-300 text-sm md:text-base">
          Stáhněte si tvořivé balíčky pracovních listů nebo si aktivujte Premium přístup k celému audio obsahu.
        </p>

        {/* Upozornění pro rozpoznaného VIP člena */}
        {isVip && (
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-xs font-bold mt-2 animate-fade-in shadow-lg">
            <Crown size={14} />
            <span>Máte aktivní VIP členství – na všechny produkty platí 10% sleva!</span>
          </div>
        )}
      </div>

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
                      {product.type === 'VIP' ? <Lock size={10} /> : <Download size={10} />}
                      {product.type === 'VIP' ? 'VIP Přístup' : 'PDF ke stažení'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition">{product.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{product.description}</p>
                  </div>
                </Link>

                <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    
                    {/* CENA (S PŘEŠKRTNUTÍM PRO VIP) */}
                    <div>
                      {isVip ? (
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
