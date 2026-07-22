import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import type { SearchHit } from '$lib/components/ui/search/ctx.svelte.js'
import Harness from './results-harness.svelte'

const mk = (type: string, id: string, title: string): SearchHit => ({
	type,
	id,
	slug: `${type}-${id}`,
	group_slug: null,
	title,
	snippet: null,
	score: 1
})

test('products render first with no heading', async () => {
	render(Harness, { hits: [mk('product', '1', 'Coffee'), mk('product', '2', 'Beans')] })
	// In dropdown mode products render as listbox options (role=option), not plain links.
	await expect.element(page.getByRole('option', { name: /Coffee/ })).toBeInTheDocument()
	// No group heading text present for products
	expect(page.getByText('Categories').query()).toBeNull()
})

test('non-product types get headings in GROUP_ORDER', async () => {
	render(Harness, {
		hits: [mk('collection', '1', 'Gift Sets'), mk('category', '2', 'Beans')]
	})
	await expect.element(page.getByText('Categories')).toBeInTheDocument()
	await expect.element(page.getByText('Collections')).toBeInTheDocument()
})

test('unknown type gets a Title-Cased heading', async () => {
	render(Harness, { hits: [mk('recipe', '1', 'Cold Brew')] })
	await expect.element(page.getByText('Recipe')).toBeInTheDocument()
})

test('custom hit snippet replaces the default Hit', async () => {
	render(Harness, { hits: [mk('product', '1', 'Coffee')], useSnippet: true })
	await expect
		.element(page.getByTestId('custom-hit'))
		.toHaveAttribute('href', '/custom/product-1')
})

test('static layout has no absolute positioning', async () => {
	const { container } = await render(Harness, {
		hits: [mk('product', '1', 'Coffee')],
		isStatic: true
	})
	const panel = container.querySelector('[data-search-results]')
	expect(panel?.className).not.toContain('absolute')
})

test('dropdown layout is absolute', async () => {
	const { container } = await render(Harness, {
		hits: [mk('product', '1', 'Coffee')],
		isStatic: false
	})
	const panel = container.querySelector('[data-search-results]')
	expect(panel?.className).toContain('absolute')
})
