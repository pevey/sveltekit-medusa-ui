import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './preset-harness.svelte'

function field(name: string) {
	let v = ''
	return { as: (t: string) => ({ name, type: t }), issues: () => undefined, value: () => v, set: (nv: string) => { v = nv }, touched: () => false, dirty: () => false }
}
function makeForm() {
	const fields: Record<string, any> = {}
	const names = ['email', 'hideBilling', 'first_name', 'last_name', 'address_1', 'address_2', 'city', 'province', 'postal_code', 'country_code', 'phone',
		'billing_first_name', 'billing_last_name', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_postal_code', 'billing_country_code', 'billing_phone']
	for (const n of names) fields[n] = field(n)
	return { fields } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]

test('preset renders the standard shipping fields inside one Root', async () => {
	render(Harness, {
		form: makeForm(), getCart: () => ({ current: null }),
		getRegions: (() => Object.assign(Promise.resolve(REGIONS), { current: REGIONS })) as any, updateCart: vi.fn()
	})
	for (const name of ['email', 'first_name', 'last_name', 'address_1', 'city', 'country_code', 'postal_code', 'phone']) {
		expect(document.querySelector(`[name=${name}]`), name).not.toBeNull()
	}
	// billing toggle present + billing hidden by default
	expect(document.querySelector('input[type=checkbox]:not(.hidden)')).not.toBeNull()
	expect(document.querySelector('[name=billing_first_name]')).toBeNull()
})
