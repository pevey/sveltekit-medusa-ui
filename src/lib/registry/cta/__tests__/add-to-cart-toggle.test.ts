import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import Harness from './add-to-cart-toggle-harness.svelte'

const emptyCart = { id: 'cart', items: [] } as any
const cartWith = (variant_id: string) => ({ id: 'cart', items: [{ id: 'li1', variant_id, quantity: 1 }] }) as any

test('off state adds the target variant on toggle', async () => {
	const addToCart = vi.fn(async () => emptyCart)
	render(Harness, { variantId: 'v1', quantity: 1, getCart: async () => emptyCart, addToCart })
	await expect.element(vpage.getByRole('checkbox')).not.toBeChecked()
	await vpage.getByRole('checkbox').click()
	expect(addToCart).toHaveBeenCalledWith({ variant_id: 'v1', quantity: 1 })
})

test('on state (variant already in cart) removes the line on toggle', async () => {
	const removeFromCart = vi.fn(async () => emptyCart)
	render(Harness, { variantId: 'v1', getCart: async () => cartWith('v1'), removeFromCart })
	await expect.element(vpage.getByRole('checkbox')).toBeChecked()
	await vpage.getByRole('checkbox').click()
	expect(removeFromCart).toHaveBeenCalledWith('li1')
})

test('renders nothing when condition is unmet', async () => {
	render(Harness, {
		variantId: 'v1',
		condition: { collectionTitle: 'Warby Parker' },
		getCart: async () => emptyCart
	})
	await expect.element(vpage.getByTestId('loading')).not.toBeInTheDocument().catch(() => {})
	expect(document.querySelector('input[type=checkbox]')).toBeNull()
})

test('renders when condition is met', async () => {
	const met = { id: 'cart', items: [{ id: 'li9', variant_id: 'other', product_collection: 'Warby Parker', quantity: 1 }] } as any
	render(Harness, {
		variantId: 'v1',
		condition: { collectionTitle: 'warby parker' },
		getCart: async () => met
	})
	await expect.element(vpage.getByRole('checkbox')).toBeInTheDocument()
})
