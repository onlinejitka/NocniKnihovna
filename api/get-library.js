import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function renderRichText(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map(t => {
    let text = t.plain_text;
    if (t.annotations.bold) text = `<strong>${text}</strong>`;
    if (t.annotations.italic) text = `<em>${text}</em>`;
    if (t.annotations.code) text = `<code class="bg-slate-800 px-1 rounded text-amber-400 font-mono">${text}</code>`;
    if (t.href) {
      text = `<a href="${t.href}" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:underline font-semibold">${text}</a>`;
    }
    return text;
  }).join('');
}

async function getPageContent(blockId) {
  const blocks = [];
  let cursor;
  while (true) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    if (!response.next_cursor) break;
    cursor = response.next_cursor;
  }

  return blocks.map(block => {
    if (block.type === 'paragraph') {
      return `<p class="mb-5 text-slate-300 leading-relaxed text-lg">${renderRichText(block.paragraph.rich_text)}</p>`;
    }
    if (block.type === 'heading_1') {
      return `<h1 class="text-3xl font-bold mt-8 mb-4 text-amber-400">${renderRichText(block.heading_1.rich_text)}</h1>`;
    }
    if (block.type === 'heading_2') {
      return `<h2 class="text-2xl font-semibold mt-6 mb-3 text-amber-300">${renderRichText(block.heading_2.rich_text)}</h2>`;
    }
    if (block.type === 'heading_3') {
      return `<h3 class="text-xl font-medium mt-4 mb-2 text-amber-200">${renderRichText(block.heading_3.rich_text)}</h3>`;
    }
    return '';
  }).join('');
}

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID,
    });

    const publishedPages = response.results.filter(page => {
      const statusValue = page.properties.Status?.select?.name || page.properties.Status?.status?.name;
      return statusValue === 'Publikováno';
    });

    const items = publishedPages.map(page => {
      const props = page.properties;
      const itemSlug = props.Slug?.rich_text?.[0]?.plain_text || '';
      const type = props.Typ?.select?.name || 'Pohádka';
      const title = props.Název?.title?.[0]?.plain_text || 'Bez názvu';
      const youtubeId = props.YouTube_ID?.rich_text?.[0]?.plain_text || '';
      const spotifyId = props.Spotify_ID?.rich_text?.[0]?.plain_text || '';

      return {
        id: page.id,
        title,
        slug: itemSlug,
        type,
        youtubeId,
        spotifyId,
        thumbnail: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=600&auto=format&fit=crop&q=60'
      };
    });

    if (slug) {
      const item = items.find(i => i.slug === slug);
      if (!item) return res.status(404).json({ error: 'Obsah nenalezen' });

      const content = await getPageContent(item.id);
      return res.status(200).json({ ...item, content });
    }

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
