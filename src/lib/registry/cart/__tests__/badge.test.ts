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

import Harness from './badge-harness.svelte'

const withItems = { current: { id: 'c', items: [{ id: 'a', quantity: 2 }, { id: 'b', quantity: 3 }] } } as any
const empty = { current: { id: 'c', items: [] } } as any

test('badge shows total quantity by default', async () => {
	h.getCart.mockReturnValue(withItems)
	render(Harness, {})
	await expect.element(vpage.getByText('5')).toBeInTheDocument()
})

test('badge mode=lines shows distinct line count', async () => {
	h.getCart.mockReturnValue(withItems)
	render(Harness, { mode: 'lines' })
	await expect.element(vpage.getByText('2')).toBeInTheDocument()
})

test('badge renders nothing when cart is empty', async () => {
	h.getCart.mockReturnValue(empty)
	const { container } = await render(Harness, {})
	expect(container.querySelector('[data-cart-badge]')).toBeNull()
})
