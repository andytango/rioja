// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://rioja.io',
	integrations: [tailwind()],
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'load',
	},
	vite: {
		server: {
			// Allow the dev preview to be reached through the tunnel host.
			allowedHosts: ['blog-next.rioja.io'],
		},
	},
});
