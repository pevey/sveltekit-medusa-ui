import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './summary-harness.svelte'

const CART = {
	id: 'c',
	subtotal: 20,
	tax_total: 2,
	shipping_total: 5,
	total: 27,
	currency_code: 'usd',
	shipping_methods: [{ name: 'Standard' }]
} as any

test('renders formatted amounts and labels for Subtotal, Tax, Shipping, and Total', async () => {
	render(Harness, {
		getCart: () => ({ current: CART })
	})

	// Check formatted amounts appear
	expect(document.body.textContent).toContain('$20.00')
	expect(document.body.textContent).toContain('$2.00')
	expect(document.body.textContent).toContain('$5.00')
	expect(document.body.textContent).toContain('$27.00')

	// Check labels appear
	expect(document.body.textContent).toContain('Subtotal')
	expect(document.body.textContent).toContain('Tax')
	expect(document.body.textContent).toContain('Total')

	// Check shipping label from cart (derived from shipping_methods)
	expect(document.body.textContent).toContain('Standard')
})

test('hides a row when the amount is null', async () => {
	const cartWithNullGiftCard = { ...CART, gift_card_total: null } as any
	render(Harness, {
		getCart: () => ({ current: cartWithNullGiftCard })
	})

	// Gift card total is null, so row should not appear
	const giftCardRows = document.querySelectorAll('[data-checkout-summary-gift-card]')
	expect(giftCardRows).toHaveLength(0)
})
