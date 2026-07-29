import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi } from 'vitest'

// Mock the SDK remotes so headless-mode tests can assert they're never called, and
// fetch-mode tests can control what they resolve to. Mirrors product-rating.test.ts.
const h = vi.hoisted(() => ({
	getReviews: vi.fn(() => ({ current: undefined }) as any),
	getReviewSummary: vi.fn(() => ({ current: undefined }) as any)
}))
vi.mock('sveltekit-medusa-sdk/reviews', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getReviews: h.getReviews,
	getReviewSummary: h.getReviewSummary
}))

import Harness from './reviews-root-harness.svelte'

const reviews = [
	{ id: 'r1', rating: 5, title: 'Great', body: 'Loved it', author_name: 'Alice', created_at: '2026-01-01' },
	{ id: 'r2', rating: 3, title: 'Okay', body: 'Meh', author_name: 'Bob', created_at: '2026-02-01' },
	{ id: 'r3', rating: 4, title: 'Good', body: 'Nice', author_name: 'Carol', created_at: '2026-03-01' }
]

test('headless: renders a supplied review array through the shared List/Review', async () => {
	const { container } = await render(Harness, { reviews })
	await expect.element(page.getByText('Alice')).toBeInTheDocument()
	await expect.element(page.getByText('Bob')).toBeInTheDocument()
	await expect.element(page.getByText('Carol')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-review]').length).toBe(3)
})

test('headless: never calls the SDK', async () => {
	h.getReviews.mockClear()
	h.getReviewSummary.mockClear()
	await render(Harness, { reviews })
	expect(h.getReviews).not.toHaveBeenCalled()
	expect(h.getReviewSummary).not.toHaveBeenCalled()
})

test('fetch mode: renders reviews fetched for a productId', async () => {
	const fetched = [
		{ id: 'f1', rating: 5, body: 'Fetched one', author_name: 'Dan', created_at: '2026-04-01' },
		{ id: 'f2', rating: 4, body: 'Fetched two', author_name: 'Eve', created_at: '2026-04-02' }
	]
	h.getReviews.mockReturnValue({ current: { reviews: fetched, count: 2 } })
	h.getReviewSummary.mockReturnValue({
		current: { average: 4.5, count: 2, distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 } }
	})

	const { container } = await render(Harness, { productId: 'p1' })

	await expect.element(page.getByText('Dan')).toBeInTheDocument()
	await expect.element(page.getByText('Eve')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-review]').length).toBe(2)
	expect(h.getReviews).toHaveBeenCalledWith(
		expect.objectContaining({ productId: 'p1', order: '-created_at', limit: 10, offset: 0 })
	)
})

test('fetch mode: paging re-fetches with a new offset', async () => {
	const fetched = [
		{ id: 'f1', rating: 5, body: 'Fetched one', author_name: 'Dan', created_at: '2026-04-01' },
		{ id: 'f2', rating: 4, body: 'Fetched two', author_name: 'Eve', created_at: '2026-04-02' }
	]
	// count (15) > pageSize (default 10) so Pagination.Root renders and Next stays enabled at page 0.
	h.getReviews.mockReturnValue({ current: { reviews: fetched, count: 15 } })
	h.getReviewSummary.mockReturnValue({
		current: { average: 4.5, count: 15, distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 } }
	})

	await render(Harness, { productId: 'p1' })

	await expect.element(page.getByText('Dan')).toBeInTheDocument()
	expect(h.getReviews).toHaveBeenCalledWith(expect.objectContaining({ productId: 'p1', offset: 0 }))

	await page.getByRole('button', { name: 'Next page' }).click()

	expect(h.getReviews).toHaveBeenCalledWith(expect.objectContaining({ productId: 'p1', offset: 10 }))
})
