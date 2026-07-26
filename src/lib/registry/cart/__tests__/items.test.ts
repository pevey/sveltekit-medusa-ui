import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'

const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	updateCartItem: vi.fn(async () => null as any),
	removeFromCart: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	updateCartItem: h.updateCartItem,
	removeFromCart: h.removeFromCart
}))

import Harness from './items-harness.svelte'

const cart = (items: any[]) => ({ current: { id: 'c', items } }) as any
const lines = [
	{ id: 'li1', product_title: 'Tee', variant_title: 'Red', quantity: 2, unit_price: 10, currency_code: 'usd', product_handle: 'tee', variant_id: 'v1' },
	{ id: 'li2', product_title: 'Mug', variant_title: 'Blue', quantity: 1, unit_price: 8, currency_code: 'usd', product_handle: 'mug', variant_id: 'v2' }
]

test('renders one row per line with title + price', async () => {
	h.getCart.mockReturnValue(cart(lines))
	const { container } = await render(Harness, {})
	expect(container.querySelectorAll('[data-cart-item]').length).toBe(2)
	await expect.element(vpage.getByText('Tee')).toBeInTheDocument()
	await expect.element(vpage.getByText('$10.00')).toBeInTheDocument()
})

test('empty cart renders Cart.Empty', async () => {
	h.getCart.mockReturnValue(cart([]))
	const { container } = await render(Harness, {})
	expect(container.querySelector('[data-cart-empty]')).not.toBeNull()
	expect(container.querySelectorAll('[data-cart-item]').length).toBe(0)
})
