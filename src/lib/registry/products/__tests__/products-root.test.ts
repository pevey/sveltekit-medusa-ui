import { render } from 'vitest-browser-svelte'
import { expect, test, beforeEach, vi } from 'vitest'
import { page as appPage } from '$app/state'
import Harness from './products-harness.svelte'
import SnippetHarness from './products-snippet-harness.svelte'

const h = vi.hoisted(() => ({ getProductsQuery: vi.fn() }))

vi.mock('sveltekit-medusa-sdk/products', async orig => ({
	...((await orig()) as object),
	getProductsQuery: h.getProductsQuery
}))

const price = (amount: number) => ({ calculated_amount: amount, original_amount: amount, currency_code: 'usd' })

const makeProduct = (n: number) => ({
	id: `prod_${n}`,
	title: `Product ${n}`,
	handle: `product-${n}`,
	thumbnail: `https://example.test/${n}.jpg`,
	options: [],
	variants: [{ id: `v_${n}`, manage_inventory: false, calculated_price: price(10 + n) }]
})

const list = (n: number) => Array.from({ length: n }, (_, i) => makeProduct(i + 1)) as never

beforeEach(() => {
	appPage.url.pathname = '/shop'
	appPage.url.search = ''
	h.getProductsQuery.mockReset()
})

test('headless mode renders one card per product', async () => {
	const { container } = await render(Harness, { products: list(3) })
	expect(container.querySelectorAll('[data-product-card]').length).toBe(3)
	expect(container.querySelector('[data-count]')?.textContent).toBe('3')
	expect(h.getProductsQuery).not.toHaveBeenCalled()
})

test('headless mode slices to pageSize and reports the page count', async () => {
	const { container } = await render(Harness, { products: list(25), pageSize: 10 })
	expect(container.querySelectorAll('[data-product-card]').length).toBe(10)
	expect(container.querySelector('[data-page-count]')?.textContent).toBe('3')
})

test('headless mode honours ?p= as a 1-based param', async () => {
	appPage.url.search = '?p=3'
	const { container } = await render(Harness, { products: list(25), pageSize: 10 })
	// Page 3 of 25 items at 10/page holds the final 5.
	expect(container.querySelectorAll('[data-product-card]').length).toBe(5)
})

test('renders the empty snippet for an empty list', async () => {
	const { container } = await render(Harness, { products: [] })
	expect(container.querySelector('[data-empty]')).not.toBeNull()
	expect(container.querySelectorAll('[data-product-card]').length).toBe(0)
})

test('fetch mode calls getProductsQuery with paging and the category filter', async () => {
	h.getProductsQuery.mockReturnValue({ current: { products: list(2), count: 2, limit: 12, offset: 0 }, loading: false, error: undefined })
	await render(Harness, { categoryId: 'pcat_1' })
	expect(h.getProductsQuery).toHaveBeenCalledWith(expect.objectContaining({ limit: 12, offset: 0, category_id: 'pcat_1' }))
})

test('fetch mode converts ?p=2 into an offset', async () => {
	appPage.url.search = '?p=2'
	h.getProductsQuery.mockReturnValue({ current: { products: list(2), count: 20, limit: 12, offset: 12 }, loading: false, error: undefined })
	await render(Harness, { categoryId: 'pcat_1' })
	expect(h.getProductsQuery).toHaveBeenCalledWith(expect.objectContaining({ limit: 12, offset: 12 }))
})

test('fetch mode derives pageCount from the server count', async () => {
	h.getProductsQuery.mockReturnValue({ current: { products: list(12), count: 30, limit: 12, offset: 0 }, loading: false, error: undefined })
	const { container } = await render(Harness, { categoryId: 'pcat_1' })
	expect(container.querySelector('[data-page-count]')?.textContent).toBe('3')
	expect(container.querySelector('[data-page-nav]')).not.toBeNull()
})

test('cards link through the href builder', async () => {
	const { container } = await render(Harness, { products: list(1), href: (p: { handle: string }) => `/x/${p.handle}` } as never)
	expect(container.querySelector('a[data-product-card-link]')?.getAttribute('href')).toBe('/x/product-1')
})

test('Grid children snippet replaces the default card', async () => {
	const { container } = await render(SnippetHarness, { products: list(2) })
	expect(container.querySelectorAll('[data-row]').length).toBe(2)
	expect(container.querySelectorAll('[data-product-card]').length).toBe(0)
})
