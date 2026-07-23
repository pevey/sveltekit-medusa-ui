// Test/build stub for the sveltekit-ui package ONLY. The real
// `sveltekit-medusa-sdk` search/product remotes import `$app/server`, which does
// not exist outside a SvelteKit app, so we alias the whole package to this stub in
// vitest. Component tests always inject their own `search` fn (or pass `product`
// directly to `Product.Root`, bypassing the fetch path), so these are never
// actually invoked.
export const search = async (_args: { q: string; limit?: number }) => ({ hits: [] })

export const getProductQuery = async (_args: {
	slug?: string
	id?: string
	region_id?: string
	country_code?: string
	fields?: string
}) => null

// Cart remotes. Components import these as DI defaults but tests inject fakes, so these are
// never invoked; they exist only so the named imports resolve in the vitest bundle.
export const addToCart = async (_args: { variant_id: string; quantity: number }) => ({ id: 'cart', items: [] })
export const removeFromCart = async (_lineId: string) => ({ id: 'cart', items: [] })
export const getCart = async () => null
