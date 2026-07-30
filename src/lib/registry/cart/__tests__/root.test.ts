import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

const cart = {
	id: 'c',
	items: [
		{ id: 'li1', quantity: 2 },
		{ id: 'li2', quantity: 3 }
	],
	item_subtotal: 50
} as any

// The component imports getCart/updateCartItem/removeFromCart from the SDK barrel. Mock just those
// three in the test file (spreading the rest of the module) — the component stays injection-free.
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

import Harness from './root-harness.svelte'

beforeEach(() => {
	h.getCart.mockReturnValue({ current: cart })
	h.updateCartItem.mockResolvedValue(cart)
	h.removeFromCart.mockResolvedValue(cart)
})

test('exposes total quantity, line count, subtotal from getCart().current', async () => {
	render(Harness, {})
	await expect.element(vpage.getByTestId('count')).toHaveTextContent('5')
	await expect.element(vpage.getByTestId('lines')).toHaveTextContent('2')
	await expect.element(vpage.getByTestId('subtotal')).toHaveTextContent('50')
})

test('updateItem calls updateCartItem and fires onupdate', async () => {
	const onupdate = vi.fn()
	render(Harness, { onupdate })
	await vpage.getByTestId('do-update').click()
	expect(h.updateCartItem).toHaveBeenCalledWith({ item_id: 'li1', quantity: 4 })
	expect(onupdate).toHaveBeenCalledWith(cart)
})

test('removeItem calls removeFromCart and fires onremove', async () => {
	const onremove = vi.fn()
	render(Harness, { onremove })
	await vpage.getByTestId('do-remove').click()
	expect(h.removeFromCart).toHaveBeenCalledWith('li1')
	expect(onremove).toHaveBeenCalledWith(cart)
})

test('onerror fires when a mutation throws', async () => {
	const onerror = vi.fn()
	h.updateCartItem.mockRejectedValueOnce(new Error('boom'))
	render(Harness, { onerror })
	await vpage.getByTestId('do-update').click()
	expect(onerror).toHaveBeenCalled()
})
