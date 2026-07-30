import { render } from 'vitest-browser-svelte'
import { expect, test, beforeEach } from 'vitest'
import { page } from '$app/state'
import Harness from './product-context-factory-harness.svelte'
import type { ProductContext } from '../ctx.svelte.js'

const price = (amount: number) => ({ calculated_amount: amount, original_amount: amount, currency_code: 'usd' })

const product = {
	id: 'prod_1',
	title: 'Tee',
	handle: 'tee',
	options: [],
	variants: [
		{ id: 'v_cheap', manage_inventory: false, calculated_price: price(10) },
		{ id: 'v_dear', manage_inventory: false, calculated_price: price(30) }
	]
} as never

beforeEach(() => {
	page.url.search = ''
})

test('url mode selects from ?v= and is navigable', async () => {
	page.url.search = '?v=v_dear'
	let ctx!: ProductContext
	const { container } = await render(Harness, { product, selection: 'url', expose: (c: ProductContext) => (ctx = c) })
	expect(container.querySelector('[data-selected]')?.textContent).toBe('v_dear')
	expect(ctx.navigable).toBe(true)
	expect(ctx.buildHref('v_cheap')).toContain('v=v_cheap')
})

test('url mode falls back to the default variant for an unknown ?v=', async () => {
	page.url.search = '?v=nope'
	const { container } = await render(Harness, { product, selection: 'url', expose: () => {} })
	expect(container.querySelector('[data-selected]')?.textContent).toBe('v_cheap')
})

test('local mode seeds the cheapest purchasable variant and ignores ?v=', async () => {
	page.url.search = '?v=v_dear'
	const { container } = await render(Harness, { product, selection: 'local', expose: () => {} })
	expect(container.querySelector('[data-selected]')?.textContent).toBe('v_cheap')
})

test('local mode is not navigable and builds empty hrefs', async () => {
	let ctx!: ProductContext
	const { container } = await render(Harness, { product, selection: 'local', expose: (c: ProductContext) => (ctx = c) })
	expect(container.querySelector('[data-navigable]')?.textContent).toBe('false')
	expect(ctx.buildHref('v_dear')).toBe('')
	expect(ctx.buildQuantityHref(2)).toBe('')
})

test('local mode selectVariant changes the selection', async () => {
	let ctx!: ProductContext
	const { container } = await render(Harness, { product, selection: 'local', expose: (c: ProductContext) => (ctx = c) })
	ctx.selectVariant('v_dear')
	await expect.poll(() => container.querySelector('[data-selected]')?.textContent).toBe('v_dear')
})

test('local mode setQuantity changes the quantity', async () => {
	let ctx!: ProductContext
	const { container } = await render(Harness, { product, selection: 'local', expose: (c: ProductContext) => (ctx = c) })
	ctx.setQuantity(3)
	await expect.poll(() => container.querySelector('[data-quantity]')?.textContent).toBe('3')
})

test('exposes the price range', async () => {
	const { container } = await render(Harness, { product, selection: 'local', expose: () => {} })
	expect(container.querySelector('[data-min]')?.textContent).toBe('10')
	expect(container.querySelector('[data-max]')?.textContent).toBe('30')
	expect(container.querySelector('[data-has-range]')?.textContent).toBe('true')
})

test('hasPriceRange is false when every variant costs the same', async () => {
	const flat = {
		id: 'p',
		variants: [
			{ id: 'a', manage_inventory: false, calculated_price: price(20) },
			{ id: 'b', manage_inventory: false, calculated_price: price(20) }
		]
	} as never
	const { container } = await render(Harness, { product: flat, selection: 'local', expose: () => {} })
	expect(container.querySelector('[data-has-range]')?.textContent).toBe('false')
})
