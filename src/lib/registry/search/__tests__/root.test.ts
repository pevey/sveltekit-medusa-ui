import { expect, test, vi, beforeEach } from 'vitest'

const h = vi.hoisted(() => ({ search: vi.fn(async () => ({ hits: [] }) as { hits: any[] }) }))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	search: h.search
}))

import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Harness from './root-harness.svelte'

const hit = (slug: string) => ({ type: 'product', id: slug, slug, group_slug: null, title: slug, snippet: null, score: 1 })

beforeEach(() => {
	h.search.mockReset()
	h.search.mockResolvedValue({ hits: [] })
})

test('Root provides SearchState context to children', async () => {
	await render(Harness)
	await expect.element(page.getByTestId('state')).toHaveTextContent('closed')
})

test('clicking outside closes (open -> closed)', async () => {
	await render(Harness)
	await page.getByTestId('open').click()
	await expect.element(page.getByTestId('state')).toHaveTextContent('open')
	await page.getByTestId('outside').click()
	await expect.element(page.getByTestId('state')).toHaveTextContent('closed')
})

test('no query prop: nothing is seeded and no search runs', async () => {
	await render(Harness)
	await expect.element(page.getByTestId('state')).toHaveTextContent('closed')
	expect(h.search).not.toHaveBeenCalled()
})

test('query prop seeds the term and searches immediately', async () => {
	h.search.mockResolvedValue({ hits: [hit('cafe-au-lait'), hit('cafetiere')] })
	await render(Harness, { query: 'cafe' })
	await expect.element(page.getByTestId('query')).toHaveTextContent('cafe')
	await expect.element(page.getByTestId('hits')).toHaveTextContent('2')
	expect(h.search).toHaveBeenCalledWith({ q: 'cafe' })
})

test('seeding does not open the dropdown', async () => {
	h.search.mockResolvedValue({ hits: [hit('cafe-au-lait')] })
	await render(Harness, { query: 'cafe' })
	await expect.element(page.getByTestId('hits')).toHaveTextContent('1')
	await expect.element(page.getByTestId('state')).toHaveTextContent('closed')
})

test('seeding below minLength clears hits without searching', async () => {
	await render(Harness, { query: 'c' })
	await expect.element(page.getByTestId('query')).toHaveTextContent('c')
	await expect.element(page.getByTestId('hits')).toHaveTextContent('0')
	expect(h.search).not.toHaveBeenCalled()
})

test('changing the query prop re-seeds', async () => {
	h.search.mockResolvedValue({ hits: [hit('cafe-au-lait')] })
	const screen = await render(Harness, { query: 'cafe' })
	await expect.element(page.getByTestId('hits')).toHaveTextContent('1')

	h.search.mockResolvedValue({ hits: [hit('tea-pot'), hit('teacup'), hit('teaspoon')] })
	await screen.rerender({ query: 'tea' })
	await expect.element(page.getByTestId('query')).toHaveTextContent('tea')
	await expect.element(page.getByTestId('hits')).toHaveTextContent('3')
	expect(h.search).toHaveBeenLastCalledWith({ q: 'tea' })
})
