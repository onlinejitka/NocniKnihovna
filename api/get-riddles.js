import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_RIDDLES_DB_ID; // Nová proměnná pro ID databáze hádanek

  if (!token || !databaseId) {
    return res.status(500).json({ error: 'Chybí konfigurace NOTION_RIDDLES_DB_ID ve Vercelu.' });
  }

  const notion = new Client({ auth: token });

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const publishedRiddles = response.results.filter(page => {
      const statusValue = page.properties.Status?.select?.name || page.properties.Status?.status?.name;
      return statusValue === 'Publikováno';
    });

    const riddles = publishedRiddles.map(page => {
      const props = page.properties;
      
      // Normalizace věkových skupin pro frontend
      let ageRaw = props.Věk?.select?.name || '3-5 let';
      let ageKey = '3-5';
      if (ageRaw.includes('6-9')) ageKey = '6-9';
      if (ageRaw.includes('10+')) ageKey = '10+';

      return {
        id: page.id,
        question: props.Otázka?.title?.[0]?.plain_text || 'Bez textu',
        options: [
          props.A?.rich_text?.[0]?.plain_text || '',
          props.B?.rich_text?.[0]?.plain_text || '',
          props.C?.rich_text?.[0]?.plain_text || '',
          props.D?.rich_text?.[0]?.plain_text || ''
        ].filter(Boolean), // Odstraní prázdné možnosti, pokud by nějaké byly
        answer: props.Správná?.select?.name || props.Správná?.rich_text?.[0]?.plain_text || '',
        age: ageKey
      };
    });

    return res.status(200).json(riddles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
