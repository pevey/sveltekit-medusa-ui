import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import SearchBox from '$lib/components/ui/search/search-box.svelte'

test('collapsed icon links to the searchUrl', async () => {
	render(SearchBox, { search: async () => ({ hits: [] }), searchUrl: '/search', breakpoint: 'md' })
	await expect.element(page.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search')
})

test('breakpoint token drives the responsive class map', async () => {
	const { container } = await render(SearchBox, {
		search: async () => ({ hits: [] }),
		breakpoint: 'lg'
	})
	const expanded = container.querySelector('[data-search-expanded]')
	const collapsed = container.querySelector('[data-search-collapsed]')
	expect(expanded?.className).toContain('hidden lg:block')
	expect(collapsed?.className).toContain('lg:hidden')
})

test('renders the search input in the expanded box', async () => {
	// Default browser-mode viewport here is mobile-width (414px), below the
	// default 'md' breakpoint, so the expanded box (`hidden md:block`) would
	// otherwise be excluded from the a11y tree. Desktop viewport per the
	// gallery1.test.ts convention in this repo.
	await page.viewport(1024, 768)
	render(SearchBox, { search: async () => ({ hits: [] }) })
	await expect.element(page.getByRole('combobox')).toBeInTheDocument()
})
