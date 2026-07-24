import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
	plugins: [tailwindcss(), svelte()],
	resolve: {
		// Specific aliases MUST precede the broad `$lib` prefix (Vite matches first-to-last).
		// The distributed registry files reference the consumer's `$lib/components/ui/*` aliases;
		// locally those map to the source under registry/ for typecheck + tests.
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
				find: '$lib/components/ui/input-province',
				replacement: fileURLToPath(new URL('./src/lib/registry/input-province', import.meta.url))
			},
			{
				find: '$lib/components/ui/address',
				replacement: fileURLToPath(new URL('./src/lib/registry/address', import.meta.url))
			},
			{ find: '$lib', replacement: fileURLToPath(new URL('./src/lib', import.meta.url)) }
		]
	}
})
