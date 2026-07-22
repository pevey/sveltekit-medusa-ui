import { expect, test, vi } from 'vitest'
import { SearchState, type SearchFn } from '$lib/components/ui/search/ctx.svelte.js'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

test('below minLength: no search call, hits cleared, not loading', async () => {
	const search = vi.fn<SearchFn>(async () => ({ hits: [] }))
	const s = new SearchState({ search, minLength: 2, debounce: 10 })
	s.query = 'a'
	s.onInput()
	await wait(30)
	expect(search).not.toHaveBeenCalled()
	expect(s.hits).toEqual([])
	expect(s.loading).toBe(false)
	expect(s.open).toBe(true)
})

test('debounce coalesces rapid input into one call', async () => {
	const search = vi.fn<SearchFn>(async () => ({ hits: [] }))
	const s = new SearchState({ search, minLength: 2, debounce: 40 })
	for (const q of ['ca', 'caf', 'cafe']) {
		s.query = q
		s.onInput()
	}
	await wait(80)
	expect(search).toHaveBeenCalledTimes(1)
	expect(search).toHaveBeenCalledWith({ q: 'cafe' })
})

test('race guard: a stale (slower earlier) response is dropped', async () => {
	let resolers: Array<(v: { hits: any[] }) => void> = []
	const search = vi.fn<SearchFn>(() => new Promise((res) => resolers.push(res)))
	const s = new SearchState({ search, minLength: 2, debounce: 0 })

	s.query = 'aa'
	s.onInput()
	await wait(5)
	s.query = 'bb'
	s.onInput()
	await wait(5)

	// Two in-flight requests. Resolve the SECOND first, then the stale FIRST.
	resolers[1]({ hits: [{ type: 'product', id: '2', slug: 'b', group_slug: null, title: 'B', snippet: null, score: 1 }] })
	await wait(5)
	resolers[0]({ hits: [{ type: 'product', id: '1', slug: 'a', group_slug: null, title: 'A', snippet: null, score: 1 }] })
	await wait(5)

	expect(s.hits.map((h) => h.id)).toEqual(['2'])
	expect(s.loading).toBe(false)
})

test('close() sets open false', () => {
	const s = new SearchState({ search: async () => ({ hits: [] }) })
	s.open = true
	s.close()
	expect(s.open).toBe(false)
})
