import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
	preprocess: vitePreprocess(),
	// Enable Svelte's experimental async (await in $derived / markup) so components can
	// resolve data reactively without $effect (which breaks SSR).
	compilerOptions: {
		experimental: {
			async: true
		}
	}
}
