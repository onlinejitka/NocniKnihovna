import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server', // Zajistí běh v reálném čase přes serverless funkce na Vercelu
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [tailwind()]
});
