// api/webhook.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@nocniknihovna.cz';

  try {
    const event = req.body;

    // Reagujeme pouze na úspěšně dokončenou platbu
    if (event && event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name || 'Milý zákazníku';

      // Získání informací o koupených věcech a odkazech ze Stripe success_url
      const successUrl = session.success_url || '';
      const urlParams = new URLSearchParams(successUrl.split('?')[1] || '');
      const rawFiles = urlParams.get('files');
      
      let downloadLinksHtml = '';

      if (rawFiles) {
        try {
          const files = JSON.parse(decodeURIComponent(rawFiles));
          downloadLinksHtml = files.map(f => 
            `<li style="margin-bottom: 10px;">
               <strong>${f.title}</strong><br/>
               <a href="${f.url}" style="background-color: #f59e0b; color: #020617; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 5px;">Stáhnout PDF soubor</a>
             </li>`
          ).join('');
        } catch (e) {
          console.error('Chyba při čtení odkazů:', e);
        }
      }

      if (!downloadLinksHtml) {
        const singleFile = urlParams.get('file');
        const singleTitle = urlParams.get('title') || 'Váš zakoupený produkt';
        if (singleFile) {
          downloadLinksHtml = `
            <li style="margin-bottom: 10px;">
              <strong>${decodeURIComponent(singleTitle)}</strong><br/>
              <a href="${decodeURIComponent(singleFile)}" style="background-color: #f59e0b; color: #020617; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 5px;">Stáhnout PDF soubor</a>
            </li>`;
        }
      }

      // Odeslání e-mailu přes Brevo API
      if (customerEmail && BREVO_API_KEY) {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: 'Noční Knihovna', email: SENDER_EMAIL },
            to: [{ email: customerEmail, name: customerName }],
            subject: '🌙 Vaše tvořivé soubory z Noční Knihovny',
            htmlContent: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #e2e8f0; padding: 30px; border-radius: 16px;">
                <h1 style="color: #fbbf24; font-size: 22px;">Děkujeme za nákup!</h1>
                <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                  Krásný den, děkujeme za vaši objednávku v Noční Knihovně. Vaše koupené materiály si můžete kdykoliv stáhnout kliknutím na odkaz níže:
                </p>
                <ul style="list-style: none; padding: 0; margin: 25px 0;">
                  ${downloadLinksHtml || '<li>Odkaz ke stažení naleznete na děkovné stránce na webu.</li>'}
                </ul>
                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 25px 0;" />
                <p style="font-size: 11px; color: #64748b; text-align: center;">
                  Noční Knihovna • Klidné usínání plné příběhů a tvoření<br/>
                  V případě dotazů odpovězte přímo na tento e-mail.
                </p>
              </div>
            `
          })
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}
