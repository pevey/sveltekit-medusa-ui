import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'

// The component imports getCart from the SDK barrel. Mock just that in the test file (spreading the
// rest of the module) — the component stays injection-free.
const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any)
}))
vi.mock('sveltekit-medusa-sdk', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart
}))

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
	h.getCart.mockReturnValue({ current: CART })
	render(Harness, {})

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
	h.getCart.mockReturnValue({ current: cartWithNullGiftCard })
	render(Harness, {})

	// Gift card total is null, so row should not appear
	const giftCardRows = document.querySelectorAll('[data-checkout-summary-gift-card]')
	expect(giftCardRows).toHaveLength(0)
})
