import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import { page } from '$app/state'
import type { StoreProduct } from '@medusajs/types'
import Harness from './options-harness.svelte'

const OV = (id: string, option_id: string) => ({ id, value: id.toUpperCase(), option_id }) as never
const product = {
	id: 'p', title: 'Tee',
	options: [{ id: 'oSize', title: 'Size', values: [{ id: 's', value: 'S', rank: 1 }, { id: 'm', value: 'M', rank: 2 }, { id: 'l', value: 'L', rank: 3 }] }],
	variants: [
		{ id: 'v_s', options: [OV('s', 'oSize')], manage_inventory: true, inventory_quantity: 5 },
		{ id: 'v_m', options: [OV('m', 'oSize')], manage_inventory: true, inventory_quantity: 0 },
		{ id: 'v_l', options: [OV('l', 'oSize')], manage_inventory: false, inventory_quantity: null }
	]
} as unknown as StoreProduct

test('renders the option title and a control per value', async () => {
	page.url = new URL('http://localhost/')
	render(Harness, { product })
	await expect.element(vpage.getByText('Size')).toBeInTheDocument()
	await expect.element(vpage.getByText('S', { exact: true })).toBeInTheDocument()
})

test('the selected value is marked aria-current', async () => {
	page.url = new URL('http://localhost/?v=v_s')
	render(Harness, { product })
	await expect.element(vpage.getByText('S', { exact: true })).toHaveAttribute('aria-current', 'true')
})

test('an in-stock value is a link to its variant (preserving params)', async () => {
	page.url = new URL('http://localhost/?v=v_s')
	render(Harness, { product })
	await expect.element(vpage.getByRole('link', { name: 'L' })).toHaveAttribute('href', '?v=v_l')
})

test('an out-of-stock value is not a link and is aria-disabled', async () => {
	page.url = new URL('http://localhost/?v=v_s')
	const { container } = await render(Harness, { product })
	expect(vpage.getByRole('link', { name: 'M' }).query()).toBeNull()
	const m = [...container.querySelectorAll('[data-value]')].find((e) => e.textContent?.trim() === 'M')
	expect(m?.getAttribute('aria-disabled')).toBe('true')
})
