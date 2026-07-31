import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

// The component tree imports getCart/getShippingOptions/selectShippingOption from the SDK barrel.
// Mock just those three in the test file (spreading the rest of the module) — the components stay
// injection-free.
const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	getShippingOptions: vi.fn(async () => [] as any[]),
	selectShippingOption: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	getShippingOptions: h.getShippingOptions,
	selectShippingOption: h.selectShippingOption
}))

import Harness from './delivery-harness.svelte'

const FAKE_OPTIONS = [
	{ id: 'so_1', name: 'Standard', amount: 5 },
	{ id: 'so_2', name: 'Express', amount: 15 }
]

const CART = { id: 'c', currency_code: 'usd', shipping_methods: [] }

beforeEach(() => {
	h.getCart.mockReset().mockReturnValue({ current: CART })
	h.getShippingOptions.mockReset().mockResolvedValue(FAKE_OPTIONS)
	h.selectShippingOption.mockReset().mockResolvedValue(CART)
})

test('after mount, renders a radio per option and auto-selects the first when cart has none', async () => {
	await render(Harness, {})

	// Wait a bit for onMount to run
	await new Promise(r => setTimeout(r, 100))

	const radios = document.querySelectorAll('input[type=radio]')
	expect(radios).toHaveLength(2)

	expect(document.body.textContent).toContain('Standard')
	expect(document.body.textContent).toContain('Express')

	// Auto-select first option on mount since cart has none
	expect(h.selectShippingOption).toHaveBeenCalledWith('so_1')
})

test('changing radio selection calls selectShippingOption with the new option id', async () => {
	await render(Harness, {})

	// Wait for onMount to run
	await new Promise(r => setTimeout(r, 100))

	h.selectShippingOption.mockClear()

	// Find and click the Express radio
	const radios = document.querySelectorAll('input[type=radio]')
	const expressRadio = radios[1] as HTMLInputElement
	expressRadio.click()

	// Wait for change handler
	await new Promise(r => setTimeout(r, 50))

	expect(h.selectShippingOption).toHaveBeenCalledWith('so_2')
})

test('re-fetches shipping options when the address changes later (options depend on the address)', async () => {
	// First mount runs before any address is entered → Medusa returns no options; once the address is
	// set, options appear. Delivery must re-fetch on the address-change signal, not stay empty.
	h.getShippingOptions.mockReset().mockResolvedValueOnce([]).mockResolvedValueOnce(FAKE_OPTIONS)

	await render(Harness, { cart: CART })

	await new Promise(r => setTimeout(r, 100))
	expect(document.querySelectorAll('input[type=radio]')).toHaveLength(0)

	// Simulate AddressForm committing the shipping address (fires the address-host change).
	;(document.querySelector('[data-testid=addr-change]') as HTMLButtonElement).click()
	await new Promise(r => setTimeout(r, 100))

	expect(h.getShippingOptions).toHaveBeenCalledTimes(2)
	expect(document.querySelectorAll('input[type=radio]')).toHaveLength(2)
})
