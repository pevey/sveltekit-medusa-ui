import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
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

import { CartDrawer } from '$lib/components/ui/cart'

test('CartDrawer renders a trigger with the badge count', async () => {
	h.getCart.mockReturnValue({ current: { id: 'c', items: [{ id: 'a', quantity: 2 }] } })
	render(CartDrawer, {})
	// The trigger + badge render even before the sheet opens.
	await expect.element(vpage.getByText('2')).toBeInTheDocument()
	await expect.element(vpage.getByText('Cart')).toBeInTheDocument()
})
