import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://witinwatersrafting-arch.github.io',
  base: '/TaiwanACA_InstManual_2020_ZH',
  integrations: [tailwind()],
});
