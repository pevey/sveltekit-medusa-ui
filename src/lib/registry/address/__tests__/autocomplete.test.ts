import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	getRegions: vi.fn(() => Object.assign(Promise.resolve([]), { current: [] }) as any),
	updateCart: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	getRegions: h.getRegions,
	updateCart: h.updateCart
}))

import Harness from './autocomplete-harness.svelte'

function field() {
	return {
		as: (t: string) => ({ name: 'address_1', type: t }),
		issues: () => undefined,
		value: () => '',
		set: vi.fn(),
		touched: () => false,
		dirty: () => false
	}
}
function makeForm() {
	return { fields: { address_1: field(), hideBilling: field() } } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]

beforeEach(() => {
	h.getCart.mockReturnValue({ current: null })
	h.getRegions.mockImplementation(() => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }))
	h.updateCart.mockResolvedValue(null)
})

test('degrades to a plain text input for address_1 when no apiKey', async () => {
	await render(Harness, { form: makeForm(), googlePlacesApiKey: undefined })
	const input = document.querySelector('input[name=address_1]')
	expect(input).not.toBeNull()
	// GPAC would mount a <gmp-place-autocomplete> host; without apiKey it must not.
	expect(document.querySelector('gmp-place-autocomplete')).toBeNull()
})
