import { render } from 'vitest-browser-svelte'
import { expect, test, beforeEach, vi } from 'vitest'
import { page as appPage } from '$app/state'
import Harness from './collections-harness.svelte'
import Card from '../collections-card.svelte'

const h = vi.hoisted(() => ({ getCollectionsQuery: vi.fn() }))

vi.mock('sveltekit-medusa-sdk/collections', async orig => ({
	...((await orig()) as object),
	getCollectionsQuery: h.getCollectionsQuery
}))

const makeCollection = (n: number, metadata: Record<string, unknown> | null = null) => ({
	id: `pcol_${n}`,
	title: `Collection ${n}`,
	handle: `collection-${n}`,
	metadata
})

const list = (n: number) => Array.from({ length: n }, (_, i) => makeCollection(i + 1)) as never

beforeEach(() => {
	appPage.url.pathname = '/collections'
	appPage.url.search = ''
	h.getCollectionsQuery.mockReset()
})

test('headless mode renders one card per collection', async () => {
	const { container } = await render(Harness, { collections: list(3) })
	expect(container.querySelectorAll('[data-collection-card]').length).toBe(3)
	expect(container.querySelector('[data-count]')?.textContent).toBe('3')
	expect(h.getCollectionsQuery).not.toHaveBeenCalled()
})

test('renders the empty snippet for an empty list', async () => {
	const { container } = await render(Harness, { collections: [] })
	expect(container.querySelector('[data-empty]')).not.toBeNull()
})

test('fetch mode passes paging to the SDK and derives the page count', async () => {
	appPage.url.search = '?p=2'
	h.getCollectionsQuery.mockReturnValue({ current: { collections: list(2), count: 30, limit: 24, offset: 24 }, loading: false, error: undefined })
	const { container } = await render(Harness, {})
	expect(h.getCollectionsQuery).toHaveBeenCalledWith(expect.objectContaining({ limit: 24, offset: 24 }))
	expect(container.querySelector('[data-page-count]')?.textContent).toBe('2')
})

test('Card renders the title as an h3 and links to /collections/<handle>', async () => {
	const { container } = await render(Card, { collection: makeCollection(1) as never })
	expect(container.querySelector('h3')?.textContent).toBe('Collection 1')
	expect(container.querySelector('a[data-collection-card-link]')?.getAttribute('href')).toBe('/collections/collection-1')
})

test('Card renders an image from metadata.thumbnail', async () => {
	const { container } = await render(Card, { collection: makeCollection(2, { thumbnail: 'https://example.test/c.jpg' }) as never })
	const img = container.querySelector('img[data-collection-card-image]') as HTMLImageElement | null
	expect(img?.getAttribute('src')).toBe('https://example.test/c.jpg')
	expect(img?.getAttribute('alt')).toBe('Collection 2')
})

test('Card degrades to text when the metadata key is absent', async () => {
	const { container } = await render(Card, { collection: makeCollection(3) as never })
	expect(container.querySelector('[data-collection-card-image]')).toBeNull()
	expect(container.querySelector('h3')?.textContent).toBe('Collection 3')
})

test('Card accepts an href builder', async () => {
	const { container } = await render(Card, { collection: makeCollection(4) as never, href: (c: { handle: string }) => `/c/${c.handle}` } as never)
	expect(container.querySelector('a[data-collection-card-link]')?.getAttribute('href')).toBe('/c/collection-4')
})
