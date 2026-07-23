import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { playwright } from '@vitest/browser-playwright'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
	plugins: [tailwindcss(), svelte()],
	resolve: {
		// Specific aliases MUST precede the broad `$lib` prefix (Vite matches first-to-last).
		alias: [
			{
				find: '$lib/components/ui/image-zoom',
				replacement: fileURLToPath(new URL('./src/lib/registry/image-zoom', import.meta.url))
			},
			{
				find: '$lib/components/ui/gallery',
				replacement: fileURLToPath(new URL('./src/lib/registry/gallery', import.meta.url))
			},
			{
				find: '$lib/components/ui/search',
				replacement: fileURLToPath(new URL('./src/lib/registry/search', import.meta.url))
			},
			{
				find: '$lib/components/ui/faq',
				replacement: fileURLToPath(new URL('./src/lib/registry/faq', import.meta.url))
			},
			{
				find: '$lib/components/ui/product',
				replacement: fileURLToPath(new URL('./src/lib/registry/product', import.meta.url))
			},
			{
				find: '$lib/components/ui/cta',
				replacement: fileURLToPath(new URL('./src/lib/registry/cta', import.meta.url))
			},
			{
				find: '$lib/components/ui/cart',
				replacement: fileURLToPath(new URL('./src/lib/registry/cart', import.meta.url))
			},
			{
				find: '$lib/components/ui/seo',
				replacement: fileURLToPath(new URL('./src/lib/registry/seo', import.meta.url))
			},
			{
				find: '$app/state',
				replacement: fileURLToPath(new URL('./src/test-stubs/app-state.svelte.ts', import.meta.url))
			},
			{
				find: '$app/navigation',
				replacement: fileURLToPath(new URL('./src/test-stubs/app-navigation.ts', import.meta.url))
			},
			{
				find: 'sveltekit-medusa-sdk',
				replacement: fileURLToPath(new URL('./src/test-stubs/sveltekit-medusa-sdk.ts', import.meta.url))
			},
			{ find: '$lib', replacement: fileURLToPath(new URL('./src/lib', import.meta.url)) }
		]
	},
	test: {
		// Real Chromium via Playwright — embla needs real layout/scroll (jsdom can't).
		setupFiles: ['./src/test-setup.ts'],
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: 'chromium', headless: true }]
		}
	}
})
