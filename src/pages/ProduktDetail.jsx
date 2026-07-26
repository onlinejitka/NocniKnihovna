import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { ShoppingBag, Download, Lock, Plus, Check, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProduktDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [buyingId, setBuyingId] = useState(null);
  
  const { cartItems, addToCart } = useCart();

useEffect(() => {
    setLoading(true);
    fetch('/api/get-products')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          const current = data.products.find(p => p.slug === slug || p.id === slug);
          setProduct(current || null);
          
          if (current) {
            setActiveImage(current.image || (current.gallery?.[0] || ''));
            const others = data.products.filter(p => p.id !== current.id);
            setRelatedProducts(others.slice(0, 3));

            // 🚀 1. ZMĚNA TITULKU PROHLÍŽEČE A VYHLEDÁVAČE
            document.title = `${current.title} | E-shop Noční Knihovna`;

            // 🤖 2. NEVIDITELNÁ VIZITKA PRO GOOGLE A AI (JSON-LD Schema)
            let script = document.getElementById('ai-product-schema');
            if (!script) {
              script = document.createElement('script');
              script.id = 'ai-product-schema';
              script.type = 'application/ld+json';
              document.head.appendChild(script);
            }
            script.textContent = JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": current.title,
              "image": current.image ? [current.image] : [],
              "description": current.detailDescription || current.description || "Tvořivý pracovní list z Noční Knihovny.",
              "brand": {
                "@type": "Brand",
                "name": "Noční Knihovna"
              },
              "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": "CZK",
                "price": current.price,
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Noční Knihovna"
                }
              }
            });
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Úklid po opuštění stránky
    return () => {
      document.title = 'Noční Knihovna | Klidné usínání plné příběhů';
      const script = document.getElementById('ai-product-schema');
      if (script) script.remove();
    };
  }, [slug]);

  const handleBuyNow = async (prod) => {
    setBuyingId(prod.id);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: prod.id })
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

  if (loading) return <div className="py-20 text-center text-slate-400 animate-pulse">Načítám detail produktu...</div>;
  if (!product) return (
    <div className="py-20 text-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-200">Produkt se nepodařilo najít</h2>
      <Link to="/eshop" className="text-amber-400 underline inline-block">Zpět do obchůdku</Link>
    </div>
  );

  const inCart = cartItems.some(i => i.id === product.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-16 animate-fade-in">
      
      {/* Tlačítko zpět */}
      <Link to="/eshop" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-amber-300 transition">
        <ArrowLeft size={16} />
        <span>Zpět do obchůdku</span>
      </Link>

      {/* Hlavní sekce produktu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Galerie obrázků */}
        <div className="space-y-4">
          <div className="aspect-video w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
            {activeImage ? (
              <img src={activeImage} alt={product.title} className="w-full h-full object-cover transition-all duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700"><ShoppingBag size={48} /></div>
            )}
            <span className="absolute top-4 left-4 bg-slate-950/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-md">
              {product.type === 'VIP' ? <Lock size={12} /> : <Download size={12} />}
              {product.type === 'VIP' ? 'VIP Přístup' : 'PDF ke stažení ihned'}
            </span>
          </div>

          {/* Náhledové miniaturky */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    activeImage === imgUrl ? 'border-amber-400 scale-95 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.title} ukázka ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info o produktu a nákup */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-tight">{product.title}</h1>
            <p className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
              <Sparkles size={16} /> Digitální tvořivý balíček pro děti
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
              <span className="text-sm text-slate-400">Cena balíčku:</span>
              <span className="text-3xl font-black text-amber-300">{product.price} Kč</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(product)}
                disabled={inCart}
                className={`py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  inCart 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                }`}
              >
                {inCart ? <> <Check size={16} /> <span>Máte v košíku</span> </> : <> <Plus size={16} /> <span>Vložit do košíku</span> </>}
              </button>

              <button
                onClick={() => handleBuyNow(product)}
                disabled={buyingId === product.id}
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {buyingId === product.id ? 'Příprava...' : 'Koupit ihned'}
              </button>
            </div>
          </div>

          {/* Výhody */}
          <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-900">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> <span>Okamžité doručení ve formátu PDF na váš e-mail</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> <span>Vytisknete si jen to, na co má dítě zrovna náladu</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> <span>Podpoříte autorskou tvorbu Noční Knihovny</span></div>
          </div>

          {/* Dlouhý popis */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">O tomto balíčku</h3>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-2">
              {product.detailDescription}
            </div>
          </div>
        </div>
      </div>

      {/* SOUVISEJÍCÍ PRODUKTY */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-slate-900">
          <h3 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
            Mohlo by se vám také líbit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <Link to={`/eshop/${rel.slug}`} key={rel.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition group">
                <div className="space-y-3">
                  <div className="aspect-video w-full bg-slate-950 rounded-xl overflow-hidden">
                    {rel.image ? <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /> : <div className="w-full h-full flex items-center justify-center text-slate-800"><ShoppingBag /></div>}
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-amber-300 transition">{rel.title}</h4>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="font-black text-amber-300 text-base">{rel.price} Kč</span>
                  <span className="text-[11px] text-slate-400 underline">Zobrazit detail</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
