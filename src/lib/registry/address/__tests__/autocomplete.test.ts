import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './autocomplete-harness.svelte'

function field() {
	return { as: (t: string) => ({ name: 'address_1', type: t }), issues: () => undefined, value: () => '', set: vi.fn(), touched: () => false, dirty: () => false }
}
function makeForm() {
	return { fields: { address_1: field(), hideBilling: field() } } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]
const common = { getCart: () => ({ current: null }), getRegions: () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }), updateCart: vi.fn() }

test('degrades to a plain text input for address_1 when no apiKey', async () => {
	render(Harness, { form: makeForm(), apiKey: undefined, ...common })
	const input = document.querySelector('input[name=address_1]')
	expect(input).not.toBeNull()
	// GPAC would mount a <gmp-place-autocomplete> host; without apiKey it must not.
	expect(document.querySelector('gmp-place-autocomplete')).toBeNull()
})
