import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test, vi, beforeEach } from 'vitest'

const h = vi.hoisted(() => ({ search: vi.fn(async () => ({ hits: [] }) as { hits: any[] }) }))
vi.mock('sveltekit-medusa-sdk', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	search: h.search
}))

import Harness from './input-harness.svelte'

beforeEach(() => {
	h.search.mockReset()
	h.search.mockResolvedValue({ hits: [] })
})

test('typing >= minLength triggers the search fn (debounced)', async () => {
	render(Harness, {})
	const input = page.getByRole('combobox', { name: 'Search' })
	await input.fill('cafe')
	await vi.waitFor(() => expect(h.search).toHaveBeenCalledWith({ q: 'cafe' }))
})

test('typing below minLength does not trigger the search fn', async () => {
	render(Harness, {})
	await page.getByRole('combobox', { name: 'Search' }).fill('a')
	await new Promise((r) => setTimeout(r, 40))
	expect(h.search).not.toHaveBeenCalled()
})
