export default async function handler(req, res) {
  const NOTION_SECRET = process.env.NOTION_TOKEN || process.env.NOTION_SECRET;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID_PRODUCTS;

  if (!NOTION_SECRET || !DATABASE_ID) {
    return res.status(500).json({ error: 'Chybí konfigurace Notionu v Env Variables.' });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Status',
          select: {
            equals: 'Publikováno'
          }
        }
      })
    });

    const data = await response.json();

    if (data.object === 'error') {
      console.error('Notion API Error:', data.message);
      return res.status(400).json({ error: data.message });
    }

    if (!data.results) {
      return res.status(200).json({ products: [] });
    }

    const products = data.results.map(page => {
      const props = page.properties;
      const getRichText = (prop) => prop?.rich_text?.[0]?.plain_text || '';
      
      return {
        id: page.id,
        title: props.Název?.title?.[0]?.plain_text || 'Bez názvu',
        slug: getRichText(props.Slug) || page.id,
        price: props.Cena?.number || 0,
        type: props.Typ?.select?.name || 'PDF',
        description: getRichText(props.Popis) || '',
        image: getRichText(props.Obrázek) || props.Obrázek?.url || '',
      };
    });

    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Chyba při načítání produktů z Notionu.' });
  }
}
