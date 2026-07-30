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

import Harness from './mutations-harness.svelte'

const cart = {
	id: 'c',
	items: [
		{
			id: 'li1',
			product_title: 'Tee',
			variant_title: 'Red',
			quantity: 2,
			unit_price: 10,
			currency_code: 'usd',
			product_handle: 'tee',
			variant_id: 'v1'
		}
	]
} as any

test('increment calls updateCartItem with quantity+1', async () => {
	h.getCart.mockReturnValue({ current: cart })
	h.updateCartItem.mockResolvedValue(cart)
	h.removeFromCart.mockResolvedValue(cart)
	await render(Harness, {})
	await vpage.getByRole('button', { name: 'Increase quantity' }).click()
	expect(h.updateCartItem).toHaveBeenCalledWith({ item_id: 'li1', quantity: 3 })
})

test('remove calls removeFromCart with the line id', async () => {
	h.getCart.mockReturnValue({ current: cart })
	h.updateCartItem.mockResolvedValue(cart)
	h.removeFromCart.mockResolvedValue(cart)
	await render(Harness, {})
	await vpage.getByRole('button', { name: 'Remove' }).click()
	expect(h.removeFromCart).toHaveBeenCalledWith('li1')
})

test('controls disable while a mutation is pending', async () => {
	// A never-resolving mutation keeps pending=true so the remove button becomes disabled.
	h.getCart.mockReturnValue({ current: cart })
	h.removeFromCart.mockResolvedValue(cart)
	let resolve: (v: any) => void = () => {}
	h.updateCartItem.mockImplementation(() => new Promise(r => (resolve = r)) as any)
	await render(Harness, {})
	await vpage.getByRole('button', { name: 'Increase quantity' }).click()
	await expect.element(vpage.getByRole('button', { name: 'Remove' })).toBeDisabled()
	resolve(cart)
})
