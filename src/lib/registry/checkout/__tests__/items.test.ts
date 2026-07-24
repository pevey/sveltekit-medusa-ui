import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import Harness from './items-harness.svelte'

const CART = { id: 'c', items: [{ id: 'li_1', product_title: 'Widget', variant_title: 'Blue', quantity: 2, unit_price: 10, subtotal: 20, currency_code: 'usd' }] }

test('renders a row per cart item with title/price/subtotal', async () => {
	render(Harness, { form: { fields: {} } as any, getCart: () => ({ current: CART }) })
	expect(document.body.textContent).toContain('Widget')
	expect(document.querySelector('[data-checkout-price]')?.textContent).toContain('$10.00')
	expect(document.querySelector('[data-checkout-item-subtotal]')?.textContent).toContain('$20.00')
})
