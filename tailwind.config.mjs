/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				mono: ['Berkeley Mono', 'monospace'],
				lato: ['Lato', 'sans-serif'],
				noto: ['Noto Sans', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
