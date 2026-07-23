import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import Harness from './add-to-cart-button-harness.svelte'

test('adds the resolved variant + quantity on click', async () => {
	const addToCart = vi.fn(async () => ({ id: 'cart', items: [] }) as any)
	render(Harness, { variantId: 'v1', quantity: 2, addToCart })
	await vpage.getByRole('button').click()
	expect(addToCart).toHaveBeenCalledWith({ variant_id: 'v1', quantity: 2 })
})

test('defaults quantity to 1 when not provided', async () => {
	const addToCart = vi.fn(async () => ({ id: 'cart', items: [] }) as any)
	render(Harness, { variantId: 'v1', addToCart })
	await vpage.getByRole('button').click()
	expect(addToCart).toHaveBeenCalledWith({ variant_id: 'v1', quantity: 1 })
})

test('is disabled with no variant id', async () => {
	render(Harness, {})
	await expect.element(vpage.getByRole('button')).toBeDisabled()
})

test('shows an accessible success message after add', async () => {
	const addToCart = vi.fn(async () => ({ id: 'cart', items: [] }) as any)
	render(Harness, { variantId: 'v1', addToCart })
	await vpage.getByRole('button').click()
	await expect.element(vpage.getByRole('status')).toHaveTextContent('Added to cart')
})

test('shows an alert + fires onerror on failure', async () => {
	const addToCart = vi.fn(async () => { throw new Error('Out of stock') })
	render(Harness, { variantId: 'v1', addToCart })
	await vpage.getByRole('button').click()
	await expect.element(vpage.getByRole('alert')).toHaveTextContent('Out of stock')
})

test('redirectTo navigates on success (and suppresses the message)', async () => {
	const addToCart = vi.fn(async () => ({ id: 'cart', items: [] }) as any)
	const navigate = vi.fn()
	render(Harness, { variantId: 'v1', addToCart, navigate, redirectTo: '/cart' })
	await vpage.getByRole('button').click()
	expect(navigate).toHaveBeenCalledWith('/cart')
})
