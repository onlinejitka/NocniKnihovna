// api/create-checkout.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const NOTION_SECRET = process.env.NOTION_TOKEN || process.env.NOTION_SECRET;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID_PRODUCTS;

  const { productId } = req.body;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Chybí STRIPE_SECRET_KEY ve Vercelu.' });
  }

  try {
    // 1. Bezpečné načtení aktuální ceny a souboru přímo z Notionu
    const notionRes = await fetch(`https://api.notion.com/v1/pages/${productId}`, {
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Notion-Version': '2022-06-28'
      }
    });
    const page = await notionRes.json();
    const props = page.properties;

    const title = props.Název?.title?.[0]?.plain_text || 'Produkt';
    const price = props.Cena?.number || 0; // v Kč
    
    // Načtení odkazů z Notionu
    const fileUrl = props.Soubor_URL?.rich_text?.[0]?.plain_text || props.Soubor_URL?.url || '';
    const type = props.Typ?.select?.name || 'PDF';

    // Stripe očekává cenu v haléřích (1 Kč = 100 haléřů)
    const unitAmount = Math.round(price * 100);
    const domain = req.headers.origin || 'https://nocniknihovna.cz';

    // 2. Vytvoření Stripe Checkout přes REST API (bez nutnosti instalovat npm balíčky)
    const params = new URLSearchParams();
    params.append('payment_method_types[]', 'card');
    params.append('line_items[0][price_data][currency]', 'czk');
    params.append('line_items[0][price_data][product_data][name]', title);
    params.append('line_items[0][price_data][unit_amount]', unitAmount.toString());
    params.append('line_items[0][quantity]', '1');
    params.append('mode', 'payment');
    
    // Adresy pro přesměrování po zaplacení / zrušení
    params.append('success_url', `${domain}/dekuji?title=${encodeURIComponent(title)}&file=${encodeURIComponent(fileUrl)}&type=${type}`);
    params.append('cancel_url', `${domain}/eshop`);

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
    return res.status(500).json({ error: 'Chyba serveru při vytváření checkoutu.' });
  }
}
