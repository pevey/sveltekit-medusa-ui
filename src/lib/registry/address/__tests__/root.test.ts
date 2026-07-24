import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
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
const regionsResource = () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }) as any
const getCartEmpty = () => ({ current: null })

test('exposes countries from regions and isAutocomplete=false without apiKey', async () => {
	render(Harness, { form: makeForm(), getCart: getCartEmpty, getRegions: regionsResource, updateCart: vi.fn() })
	expect(document.querySelector('[data-testid=countries]')!.textContent).toContain('ca')
	expect(document.querySelector('[data-testid=isAutocomplete]')!.textContent).toBe('false')
})

test('setRegionForCountry calls updateCart with the matched region_id', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	render(Harness, { form: makeForm({ country_code: 'us' }), getCart: getCartEmpty, getRegions: regionsResource, updateCart })
	;(document.querySelector('[data-testid=region-ca]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalledWith(expect.objectContaining({ region_id: 'reg_ca', shipping_address: { country_code: 'ca' } })))
})

test('save builds a payload from field values (billing mirrors shipping by default)', async () => {
	const updateCart = vi.fn(async (_args: any) => ({ id: 'cart_1' }) as any)
	render(Harness, { form: makeForm({ email: 'a@b.com', first_name: 'Ada', country_code: 'us' }), getCart: getCartEmpty, getRegions: regionsResource, updateCart })
	;(document.querySelector('[data-testid=save]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalled())
	const arg = updateCart.mock.calls.at(-1)![0]
	expect(arg.email).toBe('a@b.com')
	expect(arg.shipping_address.first_name).toBe('Ada')
	expect(arg.billing_address).toEqual(arg.shipping_address)
})

test('setBillingSameAsShipping(true) clears billing and sends billing_address:{}', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	render(Harness, { form: makeForm({ billing_first_name: 'Grace' }), getCart: getCartEmpty, getRegions: regionsResource, updateCart })
	;(document.querySelector('[data-testid=billing-off]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalledWith({ billing_address: {} }))
})

test('setAddressFromAutocomplete maps a Google Places full province name to the ISO option value', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	const form = makeForm()
	render(Harness, { form, getCart: getCartEmpty, getRegions: regionsResource, updateCart })
	;(document.querySelector('[data-testid=autocomplete]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(form.fields.province.value()).toBe('us-ca'))
})
