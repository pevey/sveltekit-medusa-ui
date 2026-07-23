import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import Harness from './root-harness.svelte'

const cart = { id: 'c', items: [{ id: 'li1', quantity: 2 }, { id: 'li2', quantity: 3 }], item_subtotal: 50 } as any
const getCart = () => ({ current: cart }) as any

test('exposes total quantity, line count, subtotal from getCart().current', async () => {
	render(Harness, { getCart, updateCartItem: async () => cart, removeFromCart: async () => cart })
	await expect.element(vpage.getByTestId('count')).toHaveTextContent('5')
	await expect.element(vpage.getByTestId('lines')).toHaveTextContent('2')
	await expect.element(vpage.getByTestId('subtotal')).toHaveTextContent('50')
})

test('updateItem calls injected updateCartItem and fires onupdate', async () => {
	const updateCartItem = vi.fn(async () => cart)
	const onupdate = vi.fn()
	render(Harness, { getCart, updateCartItem, removeFromCart: async () => cart, onupdate })
	await vpage.getByTestId('do-update').click()
	expect(updateCartItem).toHaveBeenCalledWith({ item_id: 'li1', quantity: 4 })
	expect(onupdate).toHaveBeenCalledWith(cart)
})

test('removeItem calls injected removeFromCart and fires onremove', async () => {
	const removeFromCart = vi.fn(async () => cart)
	const onremove = vi.fn()
	render(Harness, { getCart, updateCartItem: async () => cart, removeFromCart, onremove })
	await vpage.getByTestId('do-remove').click()
	expect(removeFromCart).toHaveBeenCalledWith('li1')
	expect(onremove).toHaveBeenCalledWith(cart)
})

test('onerror fires when a mutation throws', async () => {
	const onerror = vi.fn()
	render(Harness, { getCart, updateCartItem: async () => { throw new Error('boom') }, removeFromCart: async () => cart, onerror })
	await vpage.getByTestId('do-update').click()
	expect(onerror).toHaveBeenCalled()
})
