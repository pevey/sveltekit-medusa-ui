import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Harness from './items-harness.svelte'

const cart = (items: any[]) => () => ({ current: { id: 'c', items } }) as any
const lines = [
	{ id: 'li1', product_title: 'Tee', variant_title: 'Red', quantity: 2, unit_price: 10, currency_code: 'usd', product_handle: 'tee', variant_id: 'v1' },
	{ id: 'li2', product_title: 'Mug', variant_title: 'Blue', quantity: 1, unit_price: 8, currency_code: 'usd', product_handle: 'mug', variant_id: 'v2' }
]

test('renders one row per line with title + price', async () => {
	const { container } = await render(Harness, { getCart: cart(lines) })
	expect(container.querySelectorAll('[data-cart-line]').length).toBe(2)
	await expect.element(vpage.getByText('Tee')).toBeInTheDocument()
	await expect.element(vpage.getByText('$10.00')).toBeInTheDocument()
})

test('empty cart renders Cart.Empty', async () => {
	const { container } = await render(Harness, { getCart: cart([]) })
	expect(container.querySelector('[data-cart-empty]')).not.toBeNull()
	expect(container.querySelectorAll('[data-cart-line]').length).toBe(0)
})
