import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import type { SearchHit } from '$lib/components/ui/search/ctx.svelte.js'
import Harness from './hit-harness.svelte'

const mk = (over: Partial<SearchHit>): SearchHit => ({
	type: 'product', id: '1', slug: 'x', group_slug: null, title: 'T', snippet: null, score: 1, ...over
})

test('product hit links to /products/<slug>', async () => {
	render(Harness, { hit: mk({ type: 'product', slug: 'coffee', title: 'Coffee' }) })
	await expect.element(page.getByRole('link', { name: /Coffee/ })).toHaveAttribute('href', '/products/coffee')
})

test('category hit links to /categories/<slug>', async () => {
	render(Harness, { hit: mk({ type: 'category', slug: 'beans', title: 'Beans' }) })
	await expect.element(page.getByRole('link', { name: /Beans/ })).toHaveAttribute('href', '/categories/beans')
})

test('content hit links to /<slug> (root)', async () => {
	render(Harness, { hit: mk({ type: 'content', slug: 'about', title: 'About' }) })
	await expect.element(page.getByRole('link', { name: /About/ })).toHaveAttribute('href', '/about')
})

test('href override wins over the route map', async () => {
	render(Harness, {
		hit: mk({ type: 'product', slug: 'coffee', title: 'Coffee' }),
		href: (h) => `/shop/${h.slug}`
	})
	await expect.element(page.getByRole('link', { name: /Coffee/ })).toHaveAttribute('href', '/shop/coffee')
})

test('renders the snippet when present', async () => {
	render(Harness, { hit: mk({ title: 'Coffee', snippet: 'Fresh roast' }) })
	await expect.element(page.getByText('Fresh roast')).toBeInTheDocument()
})
