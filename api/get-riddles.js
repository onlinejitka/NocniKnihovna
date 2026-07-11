import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  const dbId = process.env.NOTION_RIDDLES_DB_ID;
  
  if (!dbId) {
    return res.status(500).json({ error: 'Chybí ID databáze hádanek (NOTION_RIDDLES_DB_ID).' });
  }

  try {
    const response = await notion.databases.query({ database_id: dbId });
    
    const publishedPages = response.results.filter(page => {
      const statusValue = page.properties.Status?.select?.name || page.properties.Status?.status?.name;
      return statusValue === 'Publikováno' || statusValue === 'Publikováno (HH)';
    });

    const items = publishedPages.map(page => {
      const props = page.properties;
      const getTxt = (prop) => prop?.rich_text?.[0]?.plain_text || prop?.title?.[0]?.plain_text || '';

      const question = getTxt(props['Otázka']);
      const optionA = getTxt(props['A']);
      const optionB = getTxt(props['B']);
      const optionC = getTxt(props['C']);
      const optionD = getTxt(props['D']);
      
      const correctAnswer = getTxt(props['Správná']) || props['Správná']?.select?.name || '';
      const ageGroup = props['Věk']?.select?.name || 'Ostatní';

      const options = [optionA, optionB, optionC, optionD].filter(Boolean);

      return { id: page.id, question, options, correctAnswer, ageGroup };
    });

    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
