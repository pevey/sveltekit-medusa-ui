import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import { page } from '$app/state'
import type { StoreProduct } from '@medusajs/types'
import Harness from './quantity-select-harness.svelte'

const product = {
	id: 'p1', title: 'Tee',
	options: [],
	variants: [{ id: 'v1', options: [], manage_inventory: true, allow_backorder: false, inventory_quantity: 3 }]
} as unknown as StoreProduct

test('renders options 1..effectiveMax (min(stock, maxQuantity))', async () => {
	page.url = new URL('http://localhost/product/tee')
	render(Harness, { product, navigate: () => {} })
	const opts = vpage.getByRole('option')
	await expect.element(opts.nth(0)).toHaveTextContent('1')
	// stock 3 caps below maxQuantity 5 → 3 options
	await expect.element(vpage.getByRole('combobox')).toHaveValue('1')
	expect(document.querySelectorAll('[data-quantity-select] option').length).toBe(3)
})

test('changing the select navigates to ?quantity=', async () => {
	page.url = new URL('http://localhost/product/tee?v=v1')
	const navigate = vi.fn()
	render(Harness, { product, navigate })
	const select = vpage.getByRole('combobox')
	await select.selectOptions('2')
	expect(navigate).toHaveBeenCalledWith(expect.stringContaining('quantity=2'))
})

test('out of stock disables the select', async () => {
	const oos = { ...product, variants: [{ id: 'v1', options: [], manage_inventory: true, allow_backorder: false, inventory_quantity: 0 }] } as unknown as StoreProduct
	page.url = new URL('http://localhost/product/tee')
	render(Harness, { product: oos, navigate: () => {} })
	await expect.element(vpage.getByRole('combobox')).toBeDisabled()
})

test('standalone (no Root) uses maxQuantity prop range', async () => {
	page.url = new URL('http://localhost/x')
	render(Harness, { standalone: true })
	expect(document.querySelectorAll('[data-quantity-select] option').length).toBe(5)
})
