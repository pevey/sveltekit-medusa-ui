import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	getRegions: vi.fn(() => Object.assign(Promise.resolve([]), { current: [] }) as any),
	updateCart: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	getRegions: h.getRegions,
	updateCart: h.updateCart
}))

import Harness from './billing-harness.svelte'

function field(name: string, value = '') {
	let v = value
	return { as: (t: string) => ({ name, type: t }), issues: () => undefined, value: () => v, set: (nv: string) => { v = nv }, touched: () => false, dirty: () => false }
}
function makeForm() {
	const fields: Record<string, any> = {}
	const names = ['hideBilling', 'first_name', 'last_name', 'address_1', 'address_2', 'city', 'province', 'postal_code', 'country_code', 'phone',
		'billing_first_name', 'billing_last_name', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_postal_code', 'billing_country_code', 'billing_phone']
	for (const n of names) fields[n] = field(n)
	return { fields } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]

beforeEach(() => {
	h.getCart.mockReturnValue({ current: null })
	h.getRegions.mockImplementation(() => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }))
	h.updateCart.mockResolvedValue(null)
})

test('billing block is hidden by default (same as shipping)', async () => {
	render(Harness, { form: makeForm() })
	expect(document.querySelector('input[name=billing_first_name]')).toBeNull()
})

test('unchecking the toggle reveals the billing block', async () => {
	render(Harness, { form: makeForm() })
	const cb = document.querySelector('input[type=checkbox]:not(.hidden)') as HTMLInputElement
	cb.checked = false
	cb.dispatchEvent(new Event('change', { bubbles: true }))
	await vi.waitFor(() => expect(document.querySelector('input[name=billing_first_name]')).not.toBeNull())
})

test('re-checking clears billing and sends billing_address:{}', async () => {
	const updateCart = vi.fn(async () => ({ id: 'c' }) as any)
	h.updateCart.mockImplementation(updateCart)
	render(Harness, { form: makeForm() })
	const cb = document.querySelector('input[type=checkbox]:not(.hidden)') as HTMLInputElement
	cb.checked = false; cb.dispatchEvent(new Event('change', { bubbles: true }))
	cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true }))
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalledWith({ billing_address: {} }))
})
