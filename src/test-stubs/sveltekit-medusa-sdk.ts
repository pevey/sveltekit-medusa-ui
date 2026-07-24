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
export const updateCartItem = async (_args: { item_id: string; quantity: number }) => ({ id: 'cart', items: [] })

// Region/address remotes. `getRegions`/`updateCart` are DI defaults only (tests inject fakes),
// so no-op stubs suffice. `regionForCountry`/`countriesFromRegions` are called directly by
// `Address.Root` (not injected), so these carry real implementations (copied from the SDK's
// `helpers/regions.ts`).
export const getRegions = () => Object.assign(Promise.resolve([]), { current: [] })
export const updateCart = async (_args: unknown) => null

type RegionLike = { id?: string; countries?: ({ iso_2?: string; display_name?: string } | null)[] | null }
export function regionForCountry<R extends RegionLike>(regions: R[] | null | undefined, countryCode: string): R | undefined {
	const code = countryCode.toLowerCase()
	return regions?.find((r) => r.countries?.some((c) => c?.iso_2?.toLowerCase() === code))
}
export function countriesFromRegions(regions: RegionLike[] | null | undefined): { code: string; name: string }[] {
	const byCode = new Map<string, { code: string; name: string }>()
	for (const region of regions ?? [])
		for (const c of region.countries ?? []) {
			const iso = c?.iso_2?.toLowerCase()
			if (!iso || byCode.has(iso)) continue
			byCode.set(iso, { code: iso, name: c?.display_name ?? iso.toUpperCase() })
		}
	return [...byCode.values()].sort((a, b) => a.name.localeCompare(b.name))
}
