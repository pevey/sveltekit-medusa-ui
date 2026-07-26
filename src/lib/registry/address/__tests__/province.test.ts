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

import Harness from './province-harness.svelte'

function field(name: string, value = '') {
	return { as: (t: string) => ({ name, type: t }), issues: () => undefined, value: () => value, set: vi.fn(), touched: () => false, dirty: () => false }
}
function makeForm(country: string) {
	return { fields: { province: field('province'), country_code: field('country_code', country), hideBilling: field('hideBilling') } } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]

beforeEach(() => {
	h.getCart.mockReturnValue({ current: null })
	h.getRegions.mockImplementation(() => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }))
	h.updateCart.mockResolvedValue(null)
})

test('renders a state select when country_code is us', async () => {
	render(Harness, { form: makeForm('us') })
	expect(document.querySelector('select[name=province]')).not.toBeNull()
})

test('renders a freeform text province when country_code is unconfigured', async () => {
	render(Harness, { form: makeForm('gb') })
	expect(document.querySelector('select[name=province]')).toBeNull()
	expect(document.querySelector('input[name=province]')).not.toBeNull()
})
