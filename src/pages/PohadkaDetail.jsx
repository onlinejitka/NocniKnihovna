import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function PohadkaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/get-library?slug=${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Pohádka nenalezena');
        return res.json();
      })
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setItem(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div class="text-center py-20 text-slate-400 flex flex-col items-center justify-center space-y-4">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p class="text-sm font-medium tracking-wide">Listuji stránkami příběhu...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div class="text-center py-20 text-slate-400">
        <p class="text-xl mb-4">Pohádka nebyla nalezena 🌙</p>
        <Link to="/" class="text-amber-400 hover:underline">Zpět do knihovny</Link>
      </div>
    );
  }

  return (
    <div class="max-w-4xl mx-auto animate-fade-in">
      <Link to="/" class="flex items-center space-x-2 text-slate-400 hover:text-amber-400 mb-8 transition group">
        <ArrowLeft size={18} class="transform group-hover:-translate-x-1 transition-transform" />
        <span>Zpět do knihovny</span>
      </Link>

      <h2 class="text-4xl font-bold text-amber-400 mb-1">{item.title}</h2>
      {item.autor && <p class="text-slate-400 italic mb-3">Autor: {item.autor}</p>}
      <span class="inline-block bg-slate-800 text-amber-300 text-xs px-3 py-1 rounded-full font-medium mb-8">
        {item.type}
      </span>

      {/* YouTube přehrávač */}
      {item.youtubeId && (
        <div class="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mb-8 bg-slate-900">
          <iframe src={`https://www.youtube.com/embed/${item.youtubeId}`} title={item.title} class="w-full h-full" allowFullScreen></iframe>
        </div>
      )}

      {/* Spotify přehrávač */}
      {item.spotifyId && (
        <div class="mb-10">
          <iframe src={`https://open.spotify.com/embed/${item.spotifyId}`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="rounded-xl border border-slate-800"></iframe>
        </div>
      )}

      {/* Celý text pohádky naimportovaný z Notion stránky */}
      <div class="prose prose-invert max-w-none bg-slate-900/40 p-6 md:p-10 rounded-2xl border border-slate-800/60 shadow-xl leading-relaxed text-slate-300 font-normal" dangerouslySetInnerHTML={{ __html: item.content }} />
      
      {/* Odkaz na HeroHero */}
      {item.heroHeroLink && (
        <div class="mt-8 text-center bg-gradient-to-r from-pink-900/20 to-rose-900/20 p-6 rounded-2xl border border-pink-500/20">
          <p class="text-sm text-pink-200 mb-3 font-medium">Chceš poslouchat další příběhy s předstihem?</p>
          <a href={item.heroHeroLink} target="_blank" rel="noreferrer" class="inline-flex items-center space-x-2 bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
            <Sparkles size={16} /> <span>Pustit na HeroHero</span>
          </a>
        </div>
      )}
    </div>
  );
}
