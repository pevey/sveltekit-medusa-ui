import { render } from 'vitest-browser-svelte'
import { expect, test, beforeEach, vi } from 'vitest'
import { page as appPage } from '$app/state'
import Harness from './categories-harness.svelte'
import Card from '../categories-card.svelte'

const h = vi.hoisted(() => ({ getProductCategoriesQuery: vi.fn() }))

vi.mock('sveltekit-medusa-sdk/categories', async orig => ({
	...((await orig()) as object),
	getProductCategoriesQuery: h.getProductCategoriesQuery
}))

const makeCategory = (n: number, metadata: Record<string, unknown> | null = null) => ({
	id: `pcat_${n}`,
	name: `Category ${n}`,
	handle: `category-${n}`,
	description: `About category ${n}`,
	metadata
})

const list = (n: number) => Array.from({ length: n }, (_, i) => makeCategory(i + 1)) as never

beforeEach(() => {
	appPage.url.pathname = '/categories'
	appPage.url.search = ''
	h.getProductCategoriesQuery.mockReset()
})

test('headless mode renders one card per category', async () => {
	const { container } = await render(Harness, { categories: list(3) })
	expect(container.querySelectorAll('[data-category-card]').length).toBe(3)
	expect(container.querySelector('[data-count]')?.textContent).toBe('3')
	expect(h.getProductCategoriesQuery).not.toHaveBeenCalled()
})

test('renders the empty snippet for an empty list', async () => {
	const { container } = await render(Harness, { categories: [] })
	expect(container.querySelector('[data-empty]')).not.toBeNull()
})

test('fetch mode passes paging and parent_category_id to the SDK', async () => {
	appPage.url.search = '?p=2'
	h.getProductCategoriesQuery.mockReturnValue({ current: { product_categories: list(2), count: 30, limit: 24, offset: 24 }, loading: false, error: undefined })
	const { container } = await render(Harness, { parentId: 'pcat_parent' })
	expect(h.getProductCategoriesQuery).toHaveBeenCalledWith(expect.objectContaining({ limit: 24, offset: 24, parent_category_id: 'pcat_parent' }))
	expect(container.querySelector('[data-page-count]')?.textContent).toBe('2')
})

test('Card renders the name as an h3 and links to /categories/<handle>', async () => {
	const { container } = await render(Card, { category: makeCategory(1) as never })
	expect(container.querySelector('h3')?.textContent).toBe('Category 1')
	expect(container.querySelector('a[data-category-card-link]')?.getAttribute('href')).toBe('/categories/category-1')
	expect(container.querySelector('[data-category-card-description]')?.textContent).toBe('About category 1')
})

test('Card renders an image from metadata.thumbnail', async () => {
	const { container } = await render(Card, { category: makeCategory(2, { thumbnail: 'https://example.test/c.jpg' }) as never })
	const img = container.querySelector('img[data-category-card-image]') as HTMLImageElement | null
	expect(img?.getAttribute('src')).toBe('https://example.test/c.jpg')
	expect(img?.getAttribute('alt')).toBe('Category 2')
})

test('Card reads a custom imageKey', async () => {
	const { container } = await render(Card, { category: makeCategory(3, { hero: 'https://example.test/h.jpg' }) as never, imageKey: 'hero' })
	expect(container.querySelector('img[data-category-card-image]')?.getAttribute('src')).toBe('https://example.test/h.jpg')
})

test('Card degrades to text when the metadata key is absent', async () => {
	const { container } = await render(Card, { category: makeCategory(4) as never })
	expect(container.querySelector('[data-category-card-image]')).toBeNull()
	expect(container.querySelector('h3')?.textContent).toBe('Category 4')
})

test('Card accepts an href builder', async () => {
	const { container } = await render(Card, { category: makeCategory(5) as never, href: (c: { handle: string }) => `/c/${c.handle}` } as never)
	expect(container.querySelector('a[data-category-card-link]')?.getAttribute('href')).toBe('/c/category-5')
})
