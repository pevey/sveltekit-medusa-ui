// Ambient shim so `svelte-check`/tsc can resolve `import { search } from
// 'sveltekit-medusa-sdk'` without installing the real package (whose .d.ts
// references `$app/server`). Consumers get the real types from the real SDK.
declare module 'sveltekit-medusa-sdk' {
	import type { StoreCart, StoreOrder, StoreRegion } from '@medusajs/types'

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

	// Region/address remotes (see sveltekit-sdk/src/lib/helpers/regions.ts).
	type RegionsResource = Promise<StoreRegion[]> & { current: StoreRegion[] | undefined }
	export const getRegions: () => RegionsResource
	export const updateCart: (args: {
		email?: string
		region_id?: string
		shipping_address?: Record<string, unknown>
		billing_address?: Record<string, unknown>
		metadata?: Record<string, unknown>
	}) => Promise<StoreCart | null>
	export const regionForCountry: (regions: StoreRegion[] | null | undefined, countryCode: string) => StoreRegion | undefined
	export const countriesFromRegions: (regions: unknown) => { code: string; name: string }[]

	// Checkout remotes (see sveltekit-sdk/src/lib/checkout.remote.ts).
	export const getShippingOptions: () => Promise<any[]> & { current: any[] | undefined }
	export const selectShippingOption: (optionId: string) => Promise<StoreCart | null>
	export const addPromotion: (code: string) => Promise<StoreCart | null>
	export const removePromotion: (code: string) => Promise<StoreCart | null>
	export const completeCart: () => Promise<StoreOrder | StoreCart | null>
	export const initiateBraintreePaymentSession: (args: { provider_id: string; data?: { payment_method_nonce?: string; deviceData?: string } }) => Promise<any>
	export const formatBraintreeAddress: (type: 'billing' | 'shipping', cart: StoreCart | null) => Record<string, string>
	export const braintreeCheckoutForm: any
}
