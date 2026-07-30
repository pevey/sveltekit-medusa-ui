import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import Harness from './product-parts-harness.svelte'

const price = (amount: number) => ({ calculated_amount: amount, original_amount: amount, currency_code: 'usd' })

const product = {
	id: 'prod_1',
	title: 'Tee',
	handle: 'tee',
	thumbnail: 'https://example.test/tee.jpg',
	options: [],
	variants: [
		{ id: 'v_cheap', manage_inventory: false, calculated_price: price(10) },
		{ id: 'v_dear', manage_inventory: false, calculated_price: price(30) }
	]
} as never

test('Title renders an h1 by default', async () => {
	const { container } = await render(Harness, { product })
	expect(container.querySelector('h1')?.textContent).toBe('Tee')
})

test('Title renders the requested element for as="h3"', async () => {
	const { container } = await render(Harness, { product, as: 'h3' })
	expect(container.querySelector('h3')?.textContent).toBe('Tee')
	expect(container.querySelector('h1')).toBeNull()
})

test('Thumbnail renders the product image with the title as alt text', async () => {
	const { container } = await render(Harness, { product })
	const img = container.querySelector('img[data-product-thumbnail]') as HTMLImageElement | null
	expect(img?.getAttribute('src')).toBe('https://example.test/tee.jpg')
	expect(img?.getAttribute('alt')).toBe('Tee')
	expect(img?.getAttribute('loading')).toBe('lazy')
})

test('Thumbnail renders nothing when the product has no thumbnail', async () => {
	const { container } = await render(Harness, { product: { ...(product as object), thumbnail: null } as never })
	expect(container.querySelector('[data-product-thumbnail]')).toBeNull()
})

test('PriceMin and PriceMax render the formatted range bounds', async () => {
	const { container } = await render(Harness, { product })
	expect(container.querySelector('[data-product-price-min]')?.textContent).toBe('$10.00')
	expect(container.querySelector('[data-product-price-max]')?.textContent).toBe('$30.00')
})

test('PriceMin and PriceMax render nothing without a resolved price', async () => {
	const noPrice = { id: 'p', title: 'X', handle: 'x', options: [], variants: [{ id: 'v', manage_inventory: false }] } as never
	const { container } = await render(Harness, { product: noPrice })
	expect(container.querySelector('[data-product-price-min]')).toBeNull()
	expect(container.querySelector('[data-product-price-max]')).toBeNull()
})
