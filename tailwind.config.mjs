/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ['Lato', 'sans-serif'],
			mono: ['Berkeley Mono', 'monospace'],
			noto: ['Noto Sans', 'sans-serif'],
		},
		extend: {},
	},
	plugins: [],
}
