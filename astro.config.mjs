import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  image: {
    remotePatterns:,
  },
  output: 'static' // Výsledkem bude ultra rychlý statický web pro skvělé SEO
});
