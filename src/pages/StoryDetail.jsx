import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function StoryDetail() {
  const { slug } = useParams();
  const = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-notion')
     .then(res => res.json())
     .then(data => {
        const found = data.find(item => item.slug === slug && item.type === 'Pohádka');
        setStory(found || null);
        setLoading(false);
      })
     .catch(err => {
        console.error("Failed to load story details:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a10] text-[#e2e8f0] flex items-center justify-center">
        <p className="text-sm text-[#94a3b8]">Otevíráme pohádkovou knihu...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#090a10] text-[#e2e8f0] flex flex-col items-center justify-center space-y-4">
        <p className="text-sm text-[#94a3b8]">Tato pohádka ještě nebyla zařazena do poliček.</p>
        <Link to="/" className="text-[#c084fc] hover:underline text-xs">← Zpět do knihovny</Link>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e1b4b]/30 via-[#090a10] to-[#090a10] -z-10 min-h-screen overflow-y-auto">
      <main className="max-w-2xl mx-auto px-4 py-16 w-full space-y-8">
        <nav className="text-sm">
          <Link to="/" className="text-[#c084fc] hover:underline">← Zpět do knihovny</Link>
        </nav>

        <header className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c084fc]">Čtená pohádka</span>
          <h1 className="serif text-4xl font-semibold text-white">{story.title}</h1>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {story.youtube && (
              <a href={story.youtube} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#ef4444]/20 text-[#fca5a5] text-xs font-semibold rounded-xl hover:bg-[#ef4444]/30">YouTube 📺</a>
            )}
            {story.spotify && (
              <a href={story.spotify} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#22c55e]/20 text-[#a7f3d0] text-xs font-semibold rounded-xl hover:bg-[#22c55e]/30">Spotify 🟢</a>
            )}
            {story.herohero && (
              <a href={story.herohero} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#c084fc]/20 text-[#e9d5ff] text-xs font-semibold rounded-xl hover:bg-[#c084fc]/30">Herohero ✨</a>
            )}
          </div>
        </header>

        <article className="prose prose-invert max-w-none text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line bg-[#131520] p-8 rounded-3xl border border-[#c084fc]/5 shadow-xl font-light">
          {story.content}
        </article>

        {(story.alza || story.etsy) && (
          <footer className="space-y-4 pt-6 border-t border-[#c084fc]/10">
            <h3 className="serif text-lg font-medium text-white">Doporučujeme k pohádce:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {story.alza && (
                <a href={story.alza} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#1b1e2e] hover:bg-[#252a3f] border border-[#c084fc]/5 rounded-2xl block transition-all">
                  <span className="text-[10px] font-bold text-[#c084fc] uppercase">Partnerský nákup</span>
                  <h4 className="font-medium text-white mt-1">Kniha na Alze</h4>
                  <p className="text-xs text-[#64748b] mt-0.5">Společné listování u poslechu</p>
                </a>
              )}
              {story.etsy && (
                <a href={story.etsy} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#1b1e2e] hover:bg-[#252a3f] border border-[#c084fc]/5 rounded-2xl block transition-all">
                  <span className="text-[10px] font-bold text-[#f97316] uppercase">E-shop Noční knihovny</span>
                  <h4 className="font-medium text-white mt-1">Plakát & Omalovánka</h4>
                  <p className="text-xs text-[#64748b] mt-0.5">Vybarvěte si motiv pohádky</p>
                </a>
              )}
            </div>
          </footer>
        )}
      </main>

      <footer className="w-full text-center py-8 text-xs text-[#475569] border-t border-[#c084fc]/5 mt-16 bg-[#06070a]/50">
        <p>© 2026 Noční knihovna.</p>
      </footer>
    </div>
  );
}
