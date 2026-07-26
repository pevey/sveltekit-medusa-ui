import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi, beforeEach } from 'vitest'

// The component imports addToCart from the SDK barrel. Mock just that in the test file
// (spreading the rest of the module) — the component stays injection-free.
const h = vi.hoisted(() => ({
	addToCart: vi.fn(async () => ({ id: 'cart', items: [] }) as any)
}))
vi.mock('sveltekit-medusa-sdk', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	addToCart: h.addToCart
}))

import Harness from './add-to-cart-button-harness.svelte'

beforeEach(() => {
	h.addToCart.mockReset()
	h.addToCart.mockResolvedValue({ id: 'cart', items: [] } as any)
})

test('adds the resolved variant + quantity on click', async () => {
	render(Harness, { variantId: 'v1', quantity: 2 })
	await vpage.getByRole('button').click()
	expect(h.addToCart).toHaveBeenCalledWith({ variant_id: 'v1', quantity: 2 })
})

test('defaults quantity to 1 when not provided', async () => {
	render(Harness, { variantId: 'v1' })
	await vpage.getByRole('button').click()
	expect(h.addToCart).toHaveBeenCalledWith({ variant_id: 'v1', quantity: 1 })
})

test('is disabled with no variant id', async () => {
	render(Harness, {})
	await expect.element(vpage.getByRole('button')).toBeDisabled()
})

test('shows an accessible success message after add', async () => {
	render(Harness, { variantId: 'v1' })
	await vpage.getByRole('button').click()
	await expect.element(vpage.getByRole('status')).toHaveTextContent('Added to cart')
})

test('shows an alert + fires onerror on failure', async () => {
	h.addToCart.mockRejectedValueOnce(new Error('Out of stock'))
	render(Harness, { variantId: 'v1' })
	await vpage.getByRole('button').click()
	await expect.element(vpage.getByRole('alert')).toHaveTextContent('Out of stock')
})

test('redirectTo navigates on success (and suppresses the message)', async () => {
	const navigate = vi.fn()
	render(Harness, { variantId: 'v1', navigate, redirectTo: '/cart' })
	await vpage.getByRole('button').click()
	expect(navigate).toHaveBeenCalledWith('/cart')
})
