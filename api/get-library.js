import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function extractYouTubeId(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

function extractSpotifyId(url) {
  if (!url) return '';
  const match = url.match(/spotify\.com\/(track|episode|show|playlist)\/([a-zA-Z0-9]+)/);
  return match ? `${match[1]}/${match[2]}` : '';
}

function renderRichText(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map(t => {
    let text = t.plain_text.replace(/\n/g, '<br />');
    if (t.annotations.bold) text = `<strong>${text}</strong>`;
    if (t.annotations.italic) text = `<em>${text}</em>`;
    if (t.annotations.code) text = `<code class="bg-slate-800 px-1 rounded text-amber-400 font-mono">${text}</code>`;
    if (t.href) {
      text = `<a href="${t.href}" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:underline">${text}</a>`;
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
      return `<p class="mb-4 text-slate-300 text-[17px] leading-relaxed">${renderRichText(block.paragraph.rich_text)}</p>`;
    }
    if (block.type === 'heading_2') {
      return `<h2 class="text-2xl font-semibold mt-6 mb-3 text-amber-300">${renderRichText(block.heading_2.rich_text)}</h2>`;
    }
    if (block.type === 'quote') {
      return `<blockquote class="border-l-4 border-amber-400/60 pl-4 italic text-slate-400 my-4">${renderRichText(block.quote.rich_text)}</blockquote>`;
    }
    return '';
  }).join('');
}

export default async function handler(req, res) {
  const { slug, passcode } = req.query;
  const contentDbId = process.env.NOTION_DB_ID;
  const membersDbId = process.env.NOTION_MEMBERS_DATABASE_ID; // Nová proměnná pro VIP členy

  try {
    // 1. KROK: Ověření VIP statusu uživatele podle kódu
    let isUserVip = false;
    if (passcode && membersDbId) {
      const memberCheck = await notion.databases.query({
        database_id: membersDbId,
        filter: {
          property: "Unikátní kód", // Musí přesně odpovídat sloupci v Notion
          rich_text: { equals: passcode.trim() }
        }
      });

      if (memberCheck.results.length > 0) {
        const isActive = memberCheck.results[0].properties.Aktivní?.checkbox; // Kontrola checkboxu
        if (isActive) isUserVip = true;
      }
    }

    // 2. KROK: Načtení obsahu z hlavní databáze
    const response = await notion.databases.query({ database_id: contentDbId });
    const publishedPages = response.results.filter(page => {
      const statusValue = page.properties.Status?.select?.name || page.properties.Status?.status?.name;
      return statusValue === 'Publikováno (HH)' || statusValue === 'Publikováno';
    });

    const items = publishedPages.map(page => {
      const props = page.properties;
      const itemSlug = props.Slug?.rich_text?.[0]?.plain_text || '';
      const type = props.Typ?.select?.name || 'Pohádka';
      const title = props.Název?.title?.[0]?.plain_text || 'Bez názvu';
      const autor = props.Autor?.select?.name || props.Autor?.rich_text?.[0]?.plain_text || '';
      
      const youtubeUrl = props['YouTube Link']?.url || props.YouTube?.date?.start || '';
      const youtubeId = extractYouTubeId(youtubeUrl);
      
      const spotifyUrl = props['Spotify Link']?.url || '';
      const spotifyId = extractSpotifyId(spotifyUrl);

      // Načtení odkazu na soubor (reaguje na váš nový sloupec "URL file" z obrázku 37a703.png) [source: 1]
      const rawUrlFile = props['URL file']?.url || props['URL file']?.rich_text?.[0]?.plain_text || '';

      return {
        id: page.id,
        title,
        autor,
        slug: itemSlug,
        type,
        youtubeId,
        spotifyId,
        // BEZPEČNOSTNÍ POJISTKA: Odkaz pošleme na frontend pouze pokud je uživatel VIP
        urlFile: isUserVip ? rawUrlFile : '',
        isPremium: !!rawUrlFile // Říká frontendu, zda položka vyžaduje VIP klíč
      };
    });

    if (slug) {
      const item = items.find(i => i.slug === slug);
      if (!item) return res.status(404).json({ error: 'Obsah nenalezen' });

      const content = await getPageContent(item.id);
      return res.status(200).json({ ...item, content, isUserVip });
    }

    // Pro seznam karet vrátíme informaci o VIP stavu
    return res.status(200).json({ items, isUserVip });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
