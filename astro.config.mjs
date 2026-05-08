import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://witinwatersrafting-arch.github.io',
  base: '/TaiwanACA_InstManual_2020_ZH',
  integrations: [tailwind(), mdx()],
});