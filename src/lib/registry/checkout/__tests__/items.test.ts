import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'

// The component imports getCart from the SDK barrel. Mock just that in the test file (spreading the
// rest of the module) — the component stays injection-free.
const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart
}))

import Harness from './items-harness.svelte'

const CART = {
	id: 'c',
	items: [
		{
			id: 'li_1',
			product_title: 'Widget',
			variant_title: 'Blue',
			quantity: 2,
			unit_price: 10,
			subtotal: 20,
			currency_code: 'usd'
		}
	]
}

test('renders a row per cart item with title/price/subtotal', async () => {
	h.getCart.mockReturnValue({ current: CART })
	await render(Harness, { form: { fields: {} } as any })
	expect(document.body.textContent).toContain('Widget')
	expect(document.querySelector('[data-checkout-price]')?.textContent).toContain('$10.00')
	expect(document.querySelector('[data-checkout-item-subtotal]')?.textContent).toContain('$20.00')
})
