import type { APIRoute } from 'astro';
import { getArchiveRecords } from '../lib/notion';

export const GET: APIRoute = async () => {
  const siteUrl = "https://nocniknihovna.cz";
  const records = await getArchiveRecords();

  const staticPages = [
    { url: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
    { url: `${siteUrl}/archiv`, changefreq: 'daily', priority: '0.9' },
    { url: `${siteUrl}/o-projektu`, changefreq: 'monthly', priority: '0.7' },
    { url: `${siteUrl}/podpora`, changefreq: 'monthly', priority: '0.6' },
  ];

  const archiveUrls = records.map((rec) => ({
    url: `${siteUrl}/archiv/${rec.slug}`,
    lastmod: rec.date ? new Date(rec.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const allUrls = [...staticPages, ...archiveUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // cache 1 hodinu
    },
  });
};
