export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const NOTION_SECRET = process.env.NOTION_TOKEN || process.env.NOTION_SECRET;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID_PRODUCTS;

  // Podporujeme jak pole "items" z košíku, tak jedno "productId" od tlačítka Koupit hned
  const { items, productId } = req.body;
  
  const itemsToBuy = items && items.length > 0 
    ? items 
    : (productId ? [{ id: productId }] : []);

  if (itemsToBuy.length === 0) {
    return res.status(400).json({ error: 'Košík je prázdný.' });
  }

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Chybí STRIPE_SECRET_KEY ve Vercelu.' });
  }

  try {
    // 1. Bezpečně načteme aktuální ceny všech produktů přímo z Notionu
    const verifiedItems = await Promise.all(
      itemsToBuy.map(async (item) => {
        const notionRes = await fetch(`https://api.notion.com/v1/pages/${item.id}`, {
          headers: {
            'Authorization': `Bearer ${NOTION_SECRET}`,
            'Notion-Version': '2022-06-28'
          }
        });
        const page = await notionRes.json();
        const props = page.properties;

        return {
          id: page.id,
          title: props.Název?.title?.[0]?.plain_text || 'Produkt Noční Knihovny',
          price: props.Cena?.number || 0,
          fileUrl: props.Soubor_URL?.rich_text?.[0]?.plain_text || props.Soubor_URL?.url || '',
          type: props.Typ?.select?.name || 'PDF'
        };
      })
    );

    const domain = req.headers.origin || 'https://nocniknihovna.cz';
    const params = new URLSearchParams();
    params.append('payment_method_types[]', 'card');
    params.append('mode', 'payment');

    // 2. Nastrkáme všechny položky do Stripe košíku
    verifiedItems.forEach((item, index) => {
      params.append(`line_items[${index}][price_data][currency]`, 'czk');
      params.append(`line_items[${index}][price_data][product_data][name]`, item.title);
      params.append(`line_items[${index}][price_data][unit_amount]`, Math.round(item.price * 100).toString());
      params.append(`line_items[${index}][quantity]`, '1');
    });

    // 3. Převedeme seznam koupených souborů do URL pro děkovnou stránku
    const firstTitle = verifiedItems.length === 1 ? verifiedItems[0].title : `${verifiedItems.length} produkty`;
    const filesParam = encodeURIComponent(JSON.stringify(verifiedItems.map(i => ({ title: i.title, url: i.fileUrl }))));
    
    params.append('success_url', `${domain}/dekuji?title=${encodeURIComponent(firstTitle)}&files=${filesParam}`);
    params.append('cancel_url', `${domain}/kosik`);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const session = await stripeRes.json();

    if (session.url) {
      return res.status(200).json({ url: session.url });
    } else {
      console.error('Stripe error:', session);
      return res.status(400).json({ error: 'Chyba při vytváření Stripe platby.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Chyba serveru při vytváření košíku.' });
  }
}
