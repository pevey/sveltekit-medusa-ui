import { expect, test, vi, beforeEach } from 'vitest'

const h = vi.hoisted(() => ({ search: vi.fn(async () => ({ hits: [] }) as { hits: any[] }) }))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	search: h.search
}))

import { SearchState } from '$lib/components/ui/search/ctx.svelte.js'

const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

beforeEach(() => {
	h.search.mockReset()
	h.search.mockResolvedValue({ hits: [] })
})

test('below minLength: no search call, hits cleared, not loading', async () => {
	const s = new SearchState({ minLength: 2, debounce: 10 })
	s.query = 'a'
	s.onInput()
	await wait(30)
	expect(h.search).not.toHaveBeenCalled()
	expect(s.hits).toEqual([])
	expect(s.loading).toBe(false)
	expect(s.open).toBe(true)
})

test('debounce coalesces rapid input into one call', async () => {
	const s = new SearchState({ minLength: 2, debounce: 40 })
	for (const q of ['ca', 'caf', 'cafe']) {
		s.query = q
		s.onInput()
	}
	await wait(80)
	expect(h.search).toHaveBeenCalledTimes(1)
	expect(h.search).toHaveBeenCalledWith({ q: 'cafe' })
})

test('race guard: a stale (slower earlier) response is dropped', async () => {
	let resolvers: Array<(v: { hits: any[] }) => void> = []
	h.search.mockImplementation(() => new Promise(res => resolvers.push(res)))
	const s = new SearchState({ minLength: 2, debounce: 0 })

	s.query = 'aa'
	s.onInput()
	await wait(5)
	s.query = 'bb'
	s.onInput()
	await wait(5)

	// Two in-flight requests. Resolve the SECOND first, then the stale FIRST.
	resolvers[1]({
		hits: [
			{
				type: 'product',
				id: '2',
				slug: 'b',
				group_slug: null,
				title: 'B',
				snippet: null,
				score: 1
			}
		]
	})
	await wait(5)
	resolvers[0]({
		hits: [
			{
				type: 'product',
				id: '1',
				slug: 'a',
				group_slug: null,
				title: 'A',
				snippet: null,
				score: 1
			}
		]
	})
	await wait(5)

	expect(s.hits.map(hit => hit.id)).toEqual(['2'])
	expect(s.loading).toBe(false)
})

test('close() sets open false', () => {
	const s = new SearchState()
	s.open = true
	s.close()
	expect(s.open).toBe(false)
})

test('seed() searches immediately, without waiting out the debounce', async () => {
	h.search.mockResolvedValue({
		hits: [{ type: 'product', id: '1', slug: 'cafe', group_slug: null, title: 'Cafe', snippet: null, score: 1 }]
	})
	const s = new SearchState({ minLength: 2, debounce: 500 })
	s.seed('cafe')
	await wait(20) // far below the debounce window
	expect(h.search).toHaveBeenCalledWith({ q: 'cafe' })
	expect(s.query).toBe('cafe')
	expect(s.hits).toHaveLength(1)
	expect(s.loading).toBe(false)
})

test('seed() does not open the dropdown', async () => {
	const s = new SearchState({ minLength: 2, debounce: 10 })
	s.seed('cafe')
	await wait(30)
	expect(s.open).toBe(false)
})

test('seed() below minLength clears hits and does not search', async () => {
	const s = new SearchState({ minLength: 2, debounce: 10 })
	s.hits = [{ type: 'product', id: '1', slug: 'a', group_slug: null, title: 'A', snippet: null, score: 1 }]
	s.seed('c')
	await wait(30)
	expect(h.search).not.toHaveBeenCalled()
	expect(s.query).toBe('c')
	expect(s.hits).toEqual([])
	expect(s.loading).toBe(false)
})

test('seed() cancels a pending debounced input', async () => {
	const s = new SearchState({ minLength: 2, debounce: 40 })
	s.query = 'typed'
	s.onInput()
	s.seed('seeded')
	await wait(80)
	expect(h.search).toHaveBeenCalledTimes(1)
	expect(h.search).toHaveBeenCalledWith({ q: 'seeded' })
})

test('seed() passes limit through when configured', async () => {
	const s = new SearchState({ minLength: 2, debounce: 10, limit: 5 })
	s.seed('cafe')
	await wait(20)
	expect(h.search).toHaveBeenCalledWith({ q: 'cafe', limit: 5 })
})
