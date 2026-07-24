import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './fields-harness.svelte'

function field() {
	return { as: (t: string) => ({ name: '', type: t }), issues: () => undefined, value: () => '', set: vi.fn(), touched: () => false, dirty: () => false }
}
function makeForm() {
	const fields: Record<string, any> = {}
	for (const n of ['email', 'first_name', 'last_name', 'phone', 'address_1', 'address_2', 'city', 'country_code', 'postal_code', 'hideBilling']) {
		const f = field(); f.as = (t: string) => ({ name: n, type: t }); fields[n] = f
	}
	return { fields } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]

test('renders inputs bound to the expected field names', async () => {
	render(Harness, {
		form: makeForm(), getCart: () => ({ current: null }),
		getRegions: () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }), updateCart: vi.fn()
	})
	const names = Array.from(document.querySelectorAll('input,select')).map((el) => el.getAttribute('name'))
	expect(names).toEqual(expect.arrayContaining(['email', 'first_name', 'last_name', 'phone', 'address_2', 'city', 'country_code', 'postal_code']))
})

test('the country select lists options from regions', async () => {
	render(Harness, {
		form: makeForm(), getCart: () => ({ current: null }),
		getRegions: () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }), updateCart: vi.fn()
	})
	const country = document.querySelector('select[name=country_code]') as HTMLSelectElement
	expect(Array.from(country.querySelectorAll('option')).some((o) => o.value === 'us')).toBe(true)
})

test('structured fields carry the expected autocomplete tokens', async () => {
	render(Harness, {
		form: makeForm(), getCart: () => ({ current: null }),
		getRegions: () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }), updateCart: vi.fn()
	})
	const ac = (name: string) => document.querySelector(`[name=${name}]`)?.getAttribute('autocomplete')
	expect(ac('city')).toBe('address-level2')
	expect(ac('address_2')).toBe('address-line2')
	expect(ac('country_code')).toBe('country')
})

import AddressLine1Only from './line1-harness.svelte'
test('AddressLine1 renders a text input bound to address_1 with autocomplete=address-line1', async () => {
	render(AddressLine1Only, {
		form: makeForm(), getCart: () => ({ current: null }),
		getRegions: () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }), updateCart: vi.fn()
	})
	const el = document.querySelector('input[name=address_1]') as HTMLInputElement
	expect(el).not.toBeNull()
	expect(el.getAttribute('autocomplete')).toBe('address-line1')
})
