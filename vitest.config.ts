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
