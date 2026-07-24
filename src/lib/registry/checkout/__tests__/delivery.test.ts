import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './delivery-harness.svelte'

const FAKE_OPTIONS = [
	{ id: 'so_1', name: 'Standard', amount: 5 },
	{ id: 'so_2', name: 'Express', amount: 15 }
]

const CART = { id: 'c', currency_code: 'usd', shipping_methods: [] }

test('after mount, renders a radio per option and auto-selects the first when cart has none', async () => {
	const selectShippingOption = vi.fn().mockResolvedValue(CART)
	const getShippingOptions = vi.fn().mockResolvedValue(FAKE_OPTIONS)

	render(Harness, {
		getCart: () => ({ current: CART }),
		getShippingOptions,
		selectShippingOption
	})

	// Wait a bit for onMount to run
	await new Promise(r => setTimeout(r, 100))

	const radios = document.querySelectorAll('input[type=radio]')
	expect(radios).toHaveLength(2)

	expect(document.body.textContent).toContain('Standard')
	expect(document.body.textContent).toContain('Express')

	// Auto-select first option on mount since cart has none
	expect(selectShippingOption).toHaveBeenCalledWith('so_1')
})

test('changing radio selection calls selectShippingOption with the new option id', async () => {
	const selectShippingOption = vi.fn().mockResolvedValue(CART)
	const getShippingOptions = vi.fn().mockResolvedValue(FAKE_OPTIONS)

	render(Harness, {
		getCart: () => ({ current: CART }),
		getShippingOptions,
		selectShippingOption
	})

	// Wait for onMount to run
	await new Promise(r => setTimeout(r, 100))

	selectShippingOption.mockClear()

	// Find and click the Express radio
	const radios = document.querySelectorAll('input[type=radio]')
	const expressRadio = radios[1] as HTMLInputElement
	expressRadio.click()

	// Wait for change handler
	await new Promise(r => setTimeout(r, 50))

	expect(selectShippingOption).toHaveBeenCalledWith('so_2')
})

test('re-fetches shipping options when the address changes later (options depend on the address)', async () => {
	const selectShippingOption = vi.fn().mockResolvedValue(CART)
	// First mount runs before any address is entered → Medusa returns no options; once the address is
	// set, options appear. Delivery must re-fetch on the address-change signal, not stay empty.
	const getShippingOptions = vi
		.fn()
		.mockResolvedValueOnce([])
		.mockResolvedValueOnce(FAKE_OPTIONS)

	render(Harness, {
		getCart: () => ({ current: CART }),
		getShippingOptions,
		selectShippingOption,
		cart: CART
	})

	await new Promise(r => setTimeout(r, 100))
	expect(document.querySelectorAll('input[type=radio]')).toHaveLength(0)

	// Simulate AddressForm committing the shipping address (fires the address-host change).
	;(document.querySelector('[data-testid=addr-change]') as HTMLButtonElement).click()
	await new Promise(r => setTimeout(r, 100))

	expect(getShippingOptions).toHaveBeenCalledTimes(2)
	expect(document.querySelectorAll('input[type=radio]')).toHaveLength(2)
})
