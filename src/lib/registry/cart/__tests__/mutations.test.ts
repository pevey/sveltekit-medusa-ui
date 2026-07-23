import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import Harness from './mutations-harness.svelte'

const cart = { id: 'c', items: [{ id: 'li1', product_title: 'Tee', variant_title: 'Red', quantity: 2, unit_price: 10, currency_code: 'usd', product_handle: 'tee', variant_id: 'v1' }] } as any
const getCart = () => ({ current: cart }) as any

test('increment calls updateCartItem with quantity+1', async () => {
	const updateCartItem = vi.fn(async () => cart)
	await render(Harness, { getCart, updateCartItem, removeFromCart: async () => cart })
	await vpage.getByRole('button', { name: 'Increase quantity' }).click()
	expect(updateCartItem).toHaveBeenCalledWith({ item_id: 'li1', quantity: 3 })
})

test('remove calls removeFromCart with the line id', async () => {
	const removeFromCart = vi.fn(async () => cart)
	await render(Harness, { getCart, updateCartItem: async () => cart, removeFromCart })
	await vpage.getByRole('button', { name: 'Remove' }).click()
	expect(removeFromCart).toHaveBeenCalledWith('li1')
})

test('controls disable while a mutation is pending', async () => {
	// A never-resolving mutation keeps pending=true so the remove button becomes disabled.
	let resolve: (v: any) => void = () => {}
	const updateCartItem = vi.fn(() => new Promise((r) => (resolve = r)) as any)
	await render(Harness, { getCart, updateCartItem, removeFromCart: async () => cart })
	await vpage.getByRole('button', { name: 'Increase quantity' }).click()
	await expect.element(vpage.getByRole('button', { name: 'Remove' })).toBeDisabled()
	resolve(cart)
})
