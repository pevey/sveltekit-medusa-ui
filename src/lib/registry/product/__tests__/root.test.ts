import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import { page } from '$app/state'
import type { StoreProduct } from '@medusajs/types'
import Harness from './root-harness.svelte'

const OV = (id: string, option_id: string) => ({ id, value: id, option_id }) as never
const product = {
	id: 'p1', title: 'Tee',
	options: [{ id: 'oColor', title: 'Color', values: [{ id: 'red', value: 'red', rank: 1 }, { id: 'blue', value: 'blue', rank: 2 }] }],
	variants: [
		{ id: 'v_r', options: [OV('red', 'oColor')], manage_inventory: false, inventory_quantity: null },
		{ id: 'v_bm', options: [OV('blue', 'oColor')], manage_inventory: false, inventory_quantity: null }
	]
} as unknown as StoreProduct

test('defaults selection to the highest-ranked variant when no ?v=', async () => {
	page.url = new URL('http://localhost/product/tee')
	render(Harness, { product })
	await expect.element(vpage.getByTestId('selected')).toHaveTextContent('v_r')
})

test('reads the selected variant from ?v=', async () => {
	page.url = new URL('http://localhost/product/tee?v=v_bm')
	render(Harness, { product })
	await expect.element(vpage.getByTestId('selected')).toHaveTextContent('v_bm')
})

test('buildHref preserves other params and sets v', async () => {
	page.url = new URL('http://localhost/product/tee?tab=reviews')
	render(Harness, { product })
	const href = await vpage.getByTestId('href').element().getAttribute('href')
	expect(href).toContain('tab=reviews')
	expect(href).toContain('v=v_bm')
})

test('quantity defaults to 1 when no ?quantity=', async () => {
	page.url = new URL('http://localhost/product/tee')
	render(Harness, { product })
	await expect.element(vpage.getByTestId('qty')).toHaveTextContent('1')
})

test('reads quantity from ?quantity=', async () => {
	page.url = new URL('http://localhost/product/tee?quantity=4')
	render(Harness, { product })
	await expect.element(vpage.getByTestId('qty')).toHaveTextContent('4')
})

test('invalid ?quantity= falls back to 1', async () => {
	page.url = new URL('http://localhost/product/tee?quantity=abc')
	render(Harness, { product })
	await expect.element(vpage.getByTestId('qty')).toHaveTextContent('1')
})

test('buildQuantityHref preserves variant param and sets quantity', async () => {
	page.url = new URL('http://localhost/product/tee?v=v_bm')
	render(Harness, { product })
	const href = await vpage.getByTestId('qtyhref').element().getAttribute('href')
	expect(href).toContain('v=v_bm')
	expect(href).toContain('quantity=3')
})
