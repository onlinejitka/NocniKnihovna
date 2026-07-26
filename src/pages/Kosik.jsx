import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, ArrowLeft, Crown, Check } from 'lucide-react';

export default function Kosik() {
  const { cartItems, removeFromCart, clearCart, totalPrice, vipEmail, setVipEmail, isVip } = useCart();
  const [loading, setLoading] = useState(false);
  const [inputEmail, setInputEmail] = useState(vipEmail || '');

  const handleApplyVip = (e) => {
    e.preventDefault();
    if (inputEmail.trim()) {
      setVipEmail(inputEmail.trim().toLowerCase());
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems,
          vipEmail: vipEmail || inputEmail
        })
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
        {cartItems.map((item) => {
          const itemPrice = Number(item.price) || 0;
          const discountedPrice = Math.round(itemPrice * 0.9);

          return (
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
                <div className="text-right">
                  {isVip ? (
                    <div>
                      <span className="text-xs text-slate-500 line-through block font-bold">{itemPrice} Kč</span>
                      <span className="text-lg font-black text-emerald-400 whitespace-nowrap">{discountedPrice} Kč</span>
                    </div>
                  ) : (
                    <span className="text-lg font-black text-slate-100 whitespace-nowrap">{itemPrice} Kč</span>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                  title="Odebrat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIP Slevové políčko */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
          <Crown size={18} />
          <span>Jste Premium členem Noční Knihovny?</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Zadejte váš e-mail, pod kterým máte aktivní Premium přístup. Pokud je aktivní, uplatníme na nákup 10% slevu.
        </p>
        <form onSubmit={handleApplyVip} className="flex gap-2 pt-1">
          <input
            type="email"
            placeholder="Váš VIP e-mail..."
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 flex-grow focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer flex items-center space-x-1"
          >
            {isVip ? <><Check size={14} className="text-emerald-400" /> <span>Uplatněno</span></> : <span>Aktivovat slevu</span>}
          </button>
        </form>
      </div>

      {/* Souhrn k platbě */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="space-y-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between text-lg md:text-xl font-bold">
            <span className="text-slate-300">Celkem k úhradě:</span>
            <span className="text-2xl md:text-3xl font-black text-amber-300">{totalPrice} Kč</span>
          </div>
          {isVip && (
            <p className="text-xs text-emerald-400 text-right font-semibold">
              ✨ Byla uplatněna VIP sleva 10 %
            </p>
          )}
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
