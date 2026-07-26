import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi, beforeEach } from 'vitest'

const emptyCart = { id: 'cart', items: [] } as any
const cartWith = (variant_id: string) => ({ id: 'cart', items: [{ id: 'li1', variant_id, quantity: 1 }] }) as any

// The component reads the cart via `$derived(await getCart())`, so the getCart mock is an async fn
// whose resolved value the derived awaits (no `.current`). Mock just the three fns the component uses.
const h = vi.hoisted(() => ({
	getCart: vi.fn(async () => null as any),
	addToCart: vi.fn(async () => null as any),
	removeFromCart: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	addToCart: h.addToCart,
	removeFromCart: h.removeFromCart
}))

import Harness from './add-to-cart-toggle-harness.svelte'

beforeEach(() => {
	h.getCart.mockResolvedValue(emptyCart)
	h.addToCart.mockResolvedValue(emptyCart)
	h.removeFromCart.mockResolvedValue(emptyCart)
})

test('off state adds the target variant on toggle', async () => {
	h.getCart.mockResolvedValue(emptyCart)
	render(Harness, { variantId: 'v1', quantity: 1 })
	await expect.element(vpage.getByRole('checkbox')).not.toBeChecked()
	await vpage.getByRole('checkbox').click()
	expect(h.addToCart).toHaveBeenCalledWith({ variant_id: 'v1', quantity: 1 })
})

test('on state (variant already in cart) removes the line on toggle', async () => {
	h.getCart.mockResolvedValue(cartWith('v1'))
	render(Harness, { variantId: 'v1' })
	await expect.element(vpage.getByRole('checkbox')).toBeChecked()
	await vpage.getByRole('checkbox').click()
	expect(h.removeFromCart).toHaveBeenCalledWith('li1')
})

test('renders nothing when condition is unmet', async () => {
	h.getCart.mockResolvedValue(emptyCart)
	render(Harness, { variantId: 'v1', condition: { collectionTitle: 'Warby Parker' } })
	// Best-effort wait for the suspense to settle; the real assertion is that no checkbox renders.
	await expect.element(vpage.getByTestId('loading')).not.toBeInTheDocument().catch(() => {})
	expect(document.querySelector('input[type=checkbox]')).toBeNull()
})

test('renders when condition is met', async () => {
	const met = { id: 'cart', items: [{ id: 'li9', variant_id: 'other', product_collection: 'Warby Parker', quantity: 1 }] } as any
	h.getCart.mockResolvedValue(met)
	render(Harness, { variantId: 'v1', condition: { collectionTitle: 'warby parker' } })
	await expect.element(vpage.getByRole('checkbox')).toBeInTheDocument()
})
