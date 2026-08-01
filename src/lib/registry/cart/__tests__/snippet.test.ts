import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'

const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	updateCartItem: vi.fn(async () => null as any),
	removeFromCart: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	updateCartItem: h.updateCartItem,
	removeFromCart: h.removeFromCart
}))

import Harness from './snippet-harness.svelte'

test('Root hands the whole cart to its children snippet', async () => {
	h.getCart.mockReturnValue({
		current: {
			id: 'cart_1',
			// `subtotal` comes off Medusa's computed `item_subtotal`, not a client-side sum.
			item_subtotal: 3500,
			items: [
				{ id: 'a', quantity: 2, unit_price: 1000, subtotal: 2000 },
				{ id: 'b', quantity: 3, unit_price: 500, subtotal: 1500 }
			]
		}
	} as any)
	const { container } = await render(Harness, {})
	const at = (id: string) => container.querySelector(`[data-testid="${id}"]`)?.textContent
	expect(at('id')).toBe('cart_1')
	expect(at('items')).toBe('2')
	expect(at('count')).toBe('5')
	expect(at('lines')).toBe('2')
	expect(at('subtotal')).toBe('3500')
	expect(at('loading')).toBe('false')
	expect(at('pending')).toBe('false')
})

test('snippet argument degrades gracefully with no cart', async () => {
	h.getCart.mockReturnValue({ current: null } as any)
	const { container } = await render(Harness, {})
	const at = (id: string) => container.querySelector(`[data-testid="${id}"]`)?.textContent
	expect(at('id')).toBe('none')
	expect(at('items')).toBe('0')
	expect(at('count')).toBe('0')
})
