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
				find: '$lib/components/ui/input-province',
				replacement: fileURLToPath(new URL('./src/lib/registry/input-province', import.meta.url))
			},
			{
				find: '$lib/components/ui/address',
				replacement: fileURLToPath(new URL('./src/lib/registry/address', import.meta.url))
			},
			{
				find: '$lib/components/ui/checkout',
				replacement: fileURLToPath(new URL('./src/lib/registry/checkout', import.meta.url))
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
				// Exact-match the barrel only, so per-remote subpath imports (e.g.
				// `sveltekit-medusa-sdk/auth`) pass through and can be replaced with vi.mock in tests.
				find: /^sveltekit-medusa-sdk$/,
				replacement: fileURLToPath(new URL('./src/test-stubs/sveltekit-medusa-sdk.ts', import.meta.url))
			},
			{
				find: '$app/env',
				replacement: fileURLToPath(new URL('./src/test-stubs/app-env.ts', import.meta.url))
			},
			{
				find: '$app/server',
				replacement: fileURLToPath(new URL('./src/test-stubs/app-server.ts', import.meta.url))
			},
			{
				find: '$lib/components/ui/auth',
				replacement: fileURLToPath(new URL('./src/lib/registry/auth', import.meta.url))
			},
			{
				find: '$lib/components/ui/customer',
				replacement: fileURLToPath(new URL('./src/lib/registry/customer', import.meta.url))
			},
			{ find: '$lib', replacement: fileURLToPath(new URL('./src/lib', import.meta.url)) }
		]
	},
	test: {
		// Real Chromium via Playwright — embla needs real layout/scroll (jsdom can't).
		setupFiles: ['./src/test-setup.ts'],
		// Cap concurrent browser pages. Vitest otherwise scales workers to the core count (32 here),
		// and past roughly 6-8 simultaneous Chromium pages the @vitest/browser client cannot finish
		// its handshake inside `connectTimeout` — every page in flight then fails at once with
		// "Cannot connect to the server", and the run never reports a single test. Demonstrated by
		// bisection: the same 12 test files fail at the default worker count and pass at 4.
		maxWorkers: 2,
		browser: {
			enabled: true,
			provider: playwright({
				// Playwright passes `--disable-dev-shm-usage` by default, which makes Chromium back
				// its shared memory with files under TMPDIR (/tmp) instead of /dev/shm. When /tmp is
				// a tmpfs that is close to full, those allocations start failing mid-run: module
				// requests from a freshly created tester iframe fail with "Failed to fetch
				// dynamically imported module", the iframe lands on an opaque-origin network-error
				// page ("Cannot connect to the iframe ... unknown due to CORS"), and the browser
				// process sometimes aborts outright (SIGTRAP). The failing file differed every run
				// and always passed in isolation, which is what made this look like a path or
				// concurrency bug rather than an environment one.
				//
				// Dropping the flag puts shared memory back on /dev/shm and takes the suite from
				// ~25-41 of 92 files to all 92. In a container, give the runner a real /dev/shm
				// (`docker run --shm-size=1g`) or set TMPDIR to a roomy on-disk path instead.
				launchOptions: { ignoreDefaultArgs: ['--disable-dev-shm-usage'] }
			}),
			// Default is 30s. These pages each load Tailwind + shadcn tokens through the setup file,
			// so on a busy machine startup can exceed it even at low concurrency.
			connectTimeout: 120_000,
			instances: [{ browser: 'chromium', headless: true }]
		}
	}
})
