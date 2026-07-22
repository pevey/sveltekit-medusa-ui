import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import type { SearchFn } from '$lib/components/ui/search/ctx.svelte.js'
import Harness from './input-harness.svelte'

test('typing >= minLength triggers the search fn (debounced)', async () => {
	const search = vi.fn<SearchFn>(async () => ({ hits: [] }))
	render(Harness, { search })
	const input = page.getByRole('combobox', { name: 'Search' })
	await input.fill('cafe')
	await vi.waitFor(() => expect(search).toHaveBeenCalledWith({ q: 'cafe' }))
})

test('typing below minLength does not trigger the search fn', async () => {
	const search = vi.fn<SearchFn>(async () => ({ hits: [] }))
	render(Harness, { search })
	await page.getByRole('combobox', { name: 'Search' }).fill('a')
	await new Promise((r) => setTimeout(r, 40))
	expect(search).not.toHaveBeenCalled()
})
