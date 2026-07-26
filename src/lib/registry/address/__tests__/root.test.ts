import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

// The component imports getCart/getRegions/updateCart from the SDK barrel. Mock just those three in
// the test file (spreading the rest of the module) — the component stays injection-free.
const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	getRegions: vi.fn(() => Object.assign(Promise.resolve([]), { current: [] }) as any),
	updateCart: vi.fn(async (_args: any) => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	getRegions: h.getRegions,
	updateCart: h.updateCart
}))

import Harness from './root-harness.svelte'

function field(initial = '') {
	let v = initial
	return { as: (t: string, d?: unknown) => ({ name: '', type: t }), issues: () => undefined, value: () => v, set: (nv: string) => { v = nv }, touched: () => false, dirty: () => false }
}
function makeForm(values: Record<string, string> = {}) {
	const fields: Record<string, any> = {}
	const names = [
		'email', 'hideBilling', 'first_name', 'last_name', 'address_1', 'address_2', 'city', 'province', 'postal_code', 'country_code', 'phone',
		'billing_first_name', 'billing_last_name', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_postal_code', 'billing_country_code', 'billing_phone', 'company', 'billing_company'
	]
	for (const n of names) { const f = field(values[n] ?? ''); f.as = (t: string) => ({ name: n, type: t }); fields[n] = f }
	return { fields } as any
}
const REGIONS = [
	{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] },
	{ id: 'reg_ca', countries: [{ iso_2: 'ca', display_name: 'Canada' }] }
]
const regionsResource = (rs: any[] = REGIONS) => Object.assign(Promise.resolve(rs), { current: rs })

beforeEach(() => {
	h.getCart.mockReturnValue({ current: null })
	h.getRegions.mockImplementation(() => regionsResource())
	h.updateCart.mockResolvedValue(null)
})

test('exposes countries from regions and isAutocomplete=false without apiKey', async () => {
	render(Harness, { form: makeForm() })
	expect(document.querySelector('[data-testid=countries]')!.textContent).toContain('ca')
	expect(document.querySelector('[data-testid=isAutocomplete]')!.textContent).toBe('false')
})

test('restrictToCurrentRegion narrows countries to the current region and clamps region switching', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	h.updateCart.mockImplementation(updateCart)
	h.getCart.mockReturnValue({ current: { id: 'c', region_id: 'reg_us' } })
	render(Harness, { form: makeForm({ country_code: 'us' }), restrictToCurrentRegion: true })
	const countries = document.querySelector('[data-testid=countries]')!.textContent!
	expect(countries).toContain('us')
	expect(countries).not.toContain('ca')
	// Region switching is clamped — selecting an out-of-region country does NOT switch region.
	;(document.querySelector('[data-testid=region-ca]') as HTMLButtonElement).click()
	await new Promise((r) => setTimeout(r, 50))
	expect(updateCart).not.toHaveBeenCalledWith(expect.objectContaining({ region_id: 'reg_ca' }))
})

test('setRegionForCountry calls updateCart with the matched region_id', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	h.updateCart.mockImplementation(updateCart)
	render(Harness, { form: makeForm({ country_code: 'us' }) })
	;(document.querySelector('[data-testid=region-ca]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalledWith(expect.objectContaining({ region_id: 'reg_ca', shipping_address: { country_code: 'ca' } })))
})

test('save builds a payload from field values (billing mirrors shipping by default)', async () => {
	const updateCart = vi.fn(async (_args: any) => ({ id: 'cart_1' }) as any)
	h.updateCart.mockImplementation(updateCart)
	render(Harness, { form: makeForm({ email: 'a@b.com', first_name: 'Ada', country_code: 'us' }) })
	;(document.querySelector('[data-testid=save]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalled())
	const arg = updateCart.mock.calls.at(-1)![0]
	expect(arg.email).toBe('a@b.com')
	expect(arg.shipping_address.first_name).toBe('Ada')
	expect(arg.billing_address).toEqual(arg.shipping_address)
})

test('save bundles region_id for the chosen country so region + address commit atomically', async () => {
	const updateCart = vi.fn(async (_args: any) => ({ id: 'cart_1' }) as any)
	h.updateCart.mockImplementation(updateCart)
	render(Harness, { form: makeForm({ country_code: 'ca' }) })
	;(document.querySelector('[data-testid=save]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalled())
	// Without region_id, Medusa validates 'ca' against the cart's current region and rejects it.
	expect(updateCart.mock.calls.at(-1)![0].region_id).toBe('reg_ca')
})

test('setBillingSameAsShipping(true) clears billing and sends billing_address:{}', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	h.updateCart.mockImplementation(updateCart)
	render(Harness, { form: makeForm({ billing_first_name: 'Grace' }) })
	;(document.querySelector('[data-testid=billing-off]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalledWith({ billing_address: {} }))
})

test('setAddressFromAutocomplete maps a Google Places full province name to the ISO option value', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	h.updateCart.mockImplementation(updateCart)
	const form = makeForm()
	render(Harness, { form })
	;(document.querySelector('[data-testid=autocomplete]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(form.fields.province.value()).toBe('us-ca'))
})
