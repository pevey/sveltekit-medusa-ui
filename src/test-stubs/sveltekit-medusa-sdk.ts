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
