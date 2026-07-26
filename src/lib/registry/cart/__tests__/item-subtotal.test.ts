import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
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

import Harness from './item-subtotal-harness.svelte'

const cart = (items: any[]) => ({ current: { id: 'c', items } }) as any

test('shows the Medusa-computed line subtotal', async () => {
	h.getCart.mockReturnValue(cart([{ id: 'li1', quantity: 2, unit_price: 10, subtotal: 20, currency_code: 'usd' }]))
	await render(Harness, {})
	await expect.element(vpage.getByText('$20.00')).toBeInTheDocument()
})

test('falls back to unit_price × quantity when subtotal is absent', async () => {
	h.getCart.mockReturnValue(cart([{ id: 'li1', quantity: 3, unit_price: 10, currency_code: 'usd' }]))
	await render(Harness, {})
	await expect.element(vpage.getByText('$30.00')).toBeInTheDocument()
})
