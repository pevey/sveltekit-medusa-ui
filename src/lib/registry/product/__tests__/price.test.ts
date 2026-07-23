import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import { page } from '$app/state'
import type { StoreProduct } from '@medusajs/types'
import Harness from './price-harness.svelte'

const mk = (calc: number, orig: number) =>
	({ id: 'p', title: 'x', options: [], variants: [{ id: 'v', options: [], manage_inventory: false, calculated_price: { calculated_amount: calc, original_amount: orig, currency_code: 'usd' } }] } as unknown as StoreProduct)

test('shows the calculated price', async () => {
	page.url = new URL('http://localhost/')
	render(Harness, { product: mk(10, 10) })
	await expect.element(vpage.getByText('$10.00')).toBeInTheDocument()
})

test('shows a struck-through original when on sale', async () => {
	page.url = new URL('http://localhost/')
	const { container } = await render(Harness, { product: mk(8, 10) })
	await expect.element(vpage.getByText('$8.00')).toBeInTheDocument()
	expect(container.querySelector('s[data-original]')).toBeTruthy()
})

test('renders nothing when the variant has no price (e.g. no pricing region resolved)', async () => {
	page.url = new URL('http://localhost/')
	const noPrice = {
		id: 'p', title: 'x', options: [],
		variants: [{ id: 'v', options: [], manage_inventory: false }]
	} as unknown as StoreProduct
	const { container } = await render(Harness, { product: noPrice })
	// No empty price line — the whole <p> is omitted rather than rendering a blank span.
	expect(container.querySelector('p')).toBeNull()
})
