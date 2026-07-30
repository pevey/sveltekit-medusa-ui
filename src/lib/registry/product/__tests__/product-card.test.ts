import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import Card from '../product-card.svelte'
import SnippetHarness from './product-card-snippet-harness.svelte'
import ActionsHarness from './product-card-actions-harness.svelte'

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

const flatProduct = {
	id: 'prod_2',
	title: 'Mug',
	handle: 'mug',
	options: [],
	variants: [{ id: 'v_only', manage_inventory: false, calculated_price: price(15) }]
} as never

test('renders title, thumbnail and price range', async () => {
	const { container } = await render(Card, { product })
	expect(container.querySelector('[data-product-card]')).not.toBeNull()
	expect(container.querySelector('h3')?.textContent).toBe('Tee')
	expect(container.querySelector('img[data-product-thumbnail]')).not.toBeNull()
	expect(container.querySelector('[data-product-price-min]')?.textContent).toBe('$10.00')
	expect(container.querySelector('[data-product-price-max]')?.textContent).toBe('$30.00')
})

test('renders only the min price when every variant costs the same', async () => {
	const { container } = await render(Card, { product: flatProduct })
	expect(container.querySelector('[data-product-price-min]')?.textContent).toBe('$15.00')
	expect(container.querySelector('[data-product-price-max]')).toBeNull()
})

test('links to /products/<handle> by default', async () => {
	const { container } = await render(Card, { product })
	expect(container.querySelector('a[data-product-card-link]')?.getAttribute('href')).toBe('/products/tee')
})

test('accepts an href string', async () => {
	const { container } = await render(Card, { product, href: '/shop/tee' })
	expect(container.querySelector('a[data-product-card-link]')?.getAttribute('href')).toBe('/shop/tee')
})

test('accepts an href builder', async () => {
	const { container } = await render(Card, { product, href: (p: { handle: string }) => `/x/${p.handle}` } as never)
	expect(container.querySelector('a[data-product-card-link]')?.getAttribute('href')).toBe('/x/tee')
})

test('the actions snippet renders and reads the card local context', async () => {
	const { container } = await render(ActionsHarness, { product })
	const action = container.querySelector('[data-action]')
	expect(action).not.toBeNull()
	// Seeded to the cheapest purchasable variant, so an add-to-cart adds what the card priced.
	expect(action?.getAttribute('data-variant')).toBe('v_cheap')
})

test('children snippet replaces the default body', async () => {
	const { container } = await render(SnippetHarness, { product })
	expect(container.querySelector('[data-custom]')?.textContent).toBe('custom:Tee:true')
	expect(container.querySelector('h3')).toBeNull()
	expect(container.querySelector('[data-product-price-min]')).toBeNull()
})
