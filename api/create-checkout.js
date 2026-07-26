export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const NOTION_SECRET = process.env.NOTION_TOKEN || process.env.NOTION_SECRET;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID_PRODUCTS;
  const MEMBERS_DB_ID = process.env.NOTION_MEMBERS_DATABASE_ID;

  const { items, productId, vipEmail } = req.body;
  
  const itemsToBuy = items && items.length > 0 
    ? items 
    : (productId ? [{ id: productId }] : []);

  if (itemsToBuy.length === 0) {
    return res.status(400).json({ error: 'Košík je prázdný.' });
  }

  try {
    // 1. NEPRŮSTŘELNÉ OVĚŘENÍ VIP ČLENSTVÍ V NOTIONU
    let isApprovedVip = false;

    if (vipEmail && MEMBERS_DB_ID) {
      const cleanEmail = vipEmail.trim().toLowerCase();
      
      const memberRes = await fetch(`https://api.notion.com/v1/databases/${MEMBERS_DB_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_SECRET}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            and: [
              { property: 'Aktivní', checkbox: { equals: true } },
              {
                or: [
                  { property: 'Email', title: { equals: cleanEmail } },
                  { property: 'Unikátní kód', rich_text: { equals: cleanEmail } }
                ]
              }
            ]
          }
        })
      });

      const memberData = await memberRes.json();
      if (memberData.results && memberData.results.length > 0) {
        isApprovedVip = true; // E-mail je nalezen a má zaškrtnuto Aktivní!
      }
    }

    // 2. Načtení produktů z Notionu a výpočet slevy
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

    // Nápověda e-mailu pro Stripe platební formulář
    if (vipEmail) {
      params.append('customer_email', vipEmail.trim().toLowerCase());
    }

    // 3. Vytvoření Stripe košíku s 10% slevou pro VIP
    verifiedItems.forEach((item, index) => {
      const finalPrice = isApprovedVip ? Math.round(item.price * 0.9) : item.price;
      const unitAmount = Math.round(finalPrice * 100);

      const titleWithDiscount = isApprovedVip 
        ? `${item.title} (👑 VIP Sleva 10 %)` 
        : item.title;

      params.append(`line_items[${index}][price_data][currency]`, 'czk');
      params.append(`line_items[${index}][price_data][product_data][name]`, titleWithDiscount);
      params.append(`line_items[${index}][price_data][unit_amount]`, unitAmount.toString());
      params.append(`line_items[${index}][quantity]`, '1');
    });

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
      return res.status(400).json({ error: 'Chyba při vytváření Stripe platby.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Chyba serveru při vytváření checkoutu.' });
  }
}
