import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function SongDetail() {
  const { slug } = useParams();
  const = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-notion')
     .then(res => res.json())
     .then(data => {
        const found = data.find(item => item.slug === slug && item.type === 'Písnička');
        setSong(found || null);
        setLoading(false);
      })
     .catch(err => {
        console.error("Failed to load song details:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a10] text-[#e2e8f0] flex items-center justify-center">
        <p className="text-sm text-[#94a3b8]">Ladíme nástroje...</p>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-[#090a10] text-[#e2e8f0] flex flex-col items-center justify-center space-y-4">
        <p className="text-sm text-[#94a3b8]">Tato písnička ještě nebyla nalezena.</p>
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#c084fc]">Lidová písnička</span>
          <h1 className="serif text-4xl font-semibold text-white">{song.title}</h1>
          
          {song.herohero && (
            <div className="pt-2">
              <a href={song.herohero} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-3 bg-[#c084fc] text-[#090a10] hover:bg-[#d8b4fe] text-xs font-bold rounded-xl transition-all shadow-md">
                🎤 Přehrát zpívanou verzi na Herohero
              </a>
            </div>
          )}
        </header>

        <article className="serif text-center prose prose-invert max-w-none text-md text-[#cbd5e1] leading-relaxed whitespace-pre-line bg-[#131520] p-10 rounded-3xl border border-[#c084fc]/5 shadow-xl">
          {song.content}
        </article>
      </main>

      <footer className="w-full text-center py-8 text-xs text-[#475569] border-t border-[#c084fc]/5 mt-16 bg-[#06070a]/50">
        <p>© 2026 Noční knihovna.</p>
      </footer>
    </div>
  );
}
