import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';

export default function Kosik() {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Chyba při vytváření platby.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Chyba brány.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6 animate-fade-in px-4">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto text-amber-400/40">
          <ShoppingBag size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">Váš košík je prázdný</h2>
          <p className="text-slate-400 text-sm">Zatím jste si neřekli o žádný z našich pohádkových sešitů.</p>
        </div>
        <Link to="/eshop" className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl transition shadow-lg shadow-amber-500/10">
          <ArrowLeft size={16} />
          <span>Prozkoumat obchůdek</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
          Košík ({cartItems.length})
        </h2>
        <button onClick={clearCart} className="text-xs text-slate-500 hover:text-red-400 transition underline cursor-pointer">
          Vyprázdnit košík
        </button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-950 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700"><ShoppingBag size={20} /></div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-100">{item.title}</h3>
                <span className="text-xs text-amber-300 font-semibold">{item.type || 'PDF digitální produkt'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-lg font-black text-slate-100 whitespace-nowrap">{item.price} Kč</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                title="Odebrat"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Souhrn k platbě */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between text-lg md:text-xl font-bold border-b border-slate-800/80 pb-4">
          <span className="text-slate-300">Celkem k úhradě:</span>
          <span className="text-2xl md:text-3xl font-black text-amber-300">{totalPrice} Kč</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black text-base py-4 rounded-2xl transition shadow-xl shadow-amber-500/10 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Přesměrování na platební bránu...</span>
          ) : (
            <>
              <span>Přejít k bezpečné platbě</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-amber-400" /> Okamžité doručení souborů do e-mailu ihned po zaplacení
        </p>
      </div>
    </div>
  );
}
