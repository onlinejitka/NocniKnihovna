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
    if (block.type === 'heading_1') {
      return `<h1 class="text-3xl font-bold mt-8 mb-4 text-amber-400">${renderRichText(block.heading_1.rich_text)}</h1>`;
    }
    if (block.type === 'heading_2') {
      return `<h2 class="text-2xl font-semibold mt-6 mb-3 text-amber-300">${renderRichText(block.heading_2.rich_text)}</h2>`;
    }
    if (block.type === 'heading_3') {
      return `<h3 class="text-xl font-semibold mt-4 mb-2 text-amber-200">${renderRichText(block.heading_3.rich_text)}</h3>`;
    }
    if (block.type === 'bulleted_list_item') {
      return `<li class="list-disc ml-6 mb-2 text-slate-300 text-[17px]">${renderRichText(block.bulleted_list_item.rich_text)}</li>`;
    }
    if (block.type === 'numbered_list_item') {
      return `<li class="list-decimal ml-6 mb-2 text-slate-300 text-[17px]">${renderRichText(block.numbered_list_item.rich_text)}</li>`;
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
  const membersDbId = process.env.NOTION_MEMBERS_DATABASE_ID;

  try {
    let isUserVip = false;
    if (passcode && membersDbId) {
      const memberCheck = await notion.databases.query({
        database_id: membersDbId,
        filter: {
          property: "Unikátní kód",
          rich_text: { equals: passcode.trim() }
        }
      });
      if (memberCheck.results.length > 0) {
        const isActive = memberCheck.results[0].properties.Aktivní?.checkbox;
        if (isActive) isUserVip = true;
      }
    }

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
      
      const youtubeUrl = props['YouTube Link']?.url || props.YouTube?.url || props.YouTube?.rich_text?.[0]?.plain_text || '';
      const youtubeId = extractYouTubeId(youtubeUrl);
      const thumbnail = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '';

      const spotifyUrl = props['Spotify Link']?.url || '';
      const spotifyId = extractSpotifyId(spotifyUrl);

      const urlAudio = props['URL audio']?.url || '';
      const urlOmalovankyHlavni = props['URL omalovánky hlavní']?.url || '';
      const urlOmalovanky01 = props['URL omalovánky 01']?.url || '';
      const urlOmalovanky02 = props['URL omalovánky 02']?.url || '';
      const urlOmalovanky03 = props['URL omalovánky 03']?.url || '';

      const affiliateUrl = props['Affiliate URL']?.url || '';
      const affiliateText = props['Affiliate Text']?.rich_text?.[0]?.plain_text || '';
      
      // OPRAVENO: Načítání obrázku produktu pro affiliate systém z Notion
      const affiliateImage = props['Affiliate Image']?.url || props['Affiliate Image']?.files?.[0]?.file?.url || props['Affiliate Image']?.files?.[0]?.external?.url || '';

      const premiumImages = [urlOmalovanky01, urlOmalovanky02, urlOmalovanky03].filter(Boolean);

      return {
        id: page.id,
        title,
        autor,
        slug: itemSlug,
        type,
        youtubeId,
        spotifyId,
        thumbnail,
        urlOmalovankyHlavni, 
        urlAudio,            
        premiumImages,       
        affiliateUrl,   
        affiliateText,  
        affiliateImage, // Posíláme do frontendu
        urlOmalovanky01: isUserVip ? urlOmalovanky01 : '',
        urlOmalovanky02: isUserVip ? urlOmalovanky02 : '',
        urlOmalovanky03: isUserVip ? urlOmalovanky03 : '',
        hasAudio: !!urlAudio,
        hasPremiumOmalovanky: premiumImages.length > 0
      };
    });

    if (slug) {
      const item = items.find(i => i.slug === slug);
      if (!item) return res.status(404).json({ error: 'Obsah nenalezen' });

      const content = await getPageContent(item.id);
      return res.status(200).json({ ...item, content, isUserVip });
    }

    return res.status(200).json({ items, isUserVip });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
