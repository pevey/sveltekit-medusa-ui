// Ambient shim so `svelte-check`/tsc can resolve `import { search } from
// 'sveltekit-medusa-sdk'` without installing the real package (whose .d.ts
// references `$app/server`). Consumers get the real types from the real SDK.
declare module 'sveltekit-medusa-sdk' {
	import type { StoreCart } from '@medusajs/types'

	export const search: (args: { q: string; limit?: number }) => Promise<{ hits: unknown[] }>
	export const getProductQuery: (args: {
		slug?: string
		id?: string
		region_id?: string
		country_code?: string
		fields?: string
	}) => Promise<unknown>

	// Cart remotes (see sveltekit-sdk/src/lib/cart.remote.ts).
	export const addToCart: (args: { variant_id: string; quantity: number }) => Promise<StoreCart>
	export const removeFromCart: (lineId: string) => Promise<StoreCart | null>
	export const getCart: () => Promise<StoreCart | null>
	export const updateCartItem: (args: { item_id: string; quantity: number }) => Promise<StoreCart | null>
}
