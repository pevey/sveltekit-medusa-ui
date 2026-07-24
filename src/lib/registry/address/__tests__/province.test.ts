import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './province-harness.svelte'

function field(name: string, value = '') {
	return { as: (t: string) => ({ name, type: t }), issues: () => undefined, value: () => value, set: vi.fn(), touched: () => false, dirty: () => false }
}
function makeForm(country: string) {
	return { fields: { province: field('province'), country_code: field('country_code', country), hideBilling: field('hideBilling') } } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]
const common = { getCart: () => ({ current: null }), getRegions: () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }), updateCart: vi.fn() }

test('renders a state select when country_code is us', async () => {
	render(Harness, { form: makeForm('us'), ...common })
	expect(document.querySelector('select[name=province]')).not.toBeNull()
})

test('renders a freeform text province when country_code is unconfigured', async () => {
	render(Harness, { form: makeForm('gb'), ...common })
	expect(document.querySelector('select[name=province]')).toBeNull()
	expect(document.querySelector('input[name=province]')).not.toBeNull()
})
