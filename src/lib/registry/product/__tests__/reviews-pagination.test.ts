import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi } from 'vitest'

const h = vi.hoisted(() => ({
	getReviewSummary: vi.fn((_args?: Record<string, unknown>) => ({ current: undefined }) as any),
	getReviews: vi.fn((_args?: Record<string, unknown>) => ({ current: { reviews: [], count: 0 } }) as any)
}))
vi.mock('sveltekit-medusa-sdk/reviews', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getReviewSummary: h.getReviewSummary,
	getReviews: h.getReviews
}))

import Harness from './reviews-pagination-harness.svelte'

test('Prev disabled on first page, Next advances offset', async () => {
	h.getReviewSummary.mockReturnValue({
		current: { average: 4, count: 25, distribution: { 1: 0, 2: 0, 3: 0, 4: 5, 5: 20 } }
	})
	h.getReviews.mockReturnValue({
		current: { reviews: [{ id: 'r1', rating: 5, body: 'b', author_name: 'A', created_at: '2026-01-01' }], count: 25 }
	})
	const { container } = await render(Harness, { productId: 'p1' })
	await expect.element(vpage.getByText('Page 1 of 3')).toBeInTheDocument()
	await expect.element(vpage.getByRole('button', { name: 'Previous page' })).toBeDisabled()
	await vpage.getByRole('button', { name: 'Next page' }).click()
	expect(h.getReviews.mock.calls.at(-1)![0]).toMatchObject({ offset: 10, limit: 10 })
})

test('Pagination hidden when count <= pageSize', async () => {
	h.getReviewSummary.mockReturnValue({
		current: { average: 4, count: 4, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 4 } }
	})
	h.getReviews.mockReturnValue({ current: { reviews: [], count: 4 } })
	const { container } = await render(Harness, { productId: 'p1' })
	expect(container.querySelector('[data-pagination]')).toBeNull()
})

test('pagination bounds use the filtered getReviews count, not the summary total', async () => {
	// Unfiltered summary total is 100, but a rating filter narrows getReviews to 60 —
	// pagination must reflect 60 (6 pages), not 100 (10 pages).
	h.getReviewSummary.mockReturnValue({
		current: { average: 4, count: 100, distribution: { 1: 0, 2: 0, 3: 0, 4: 40, 5: 60 } }
	})
	h.getReviews.mockReturnValue({
		current: {
			reviews: [{ id: 'r1', rating: 5, body: 'b', author_name: 'A', created_at: '2026-01-01' }],
			count: 60
		}
	})
	const { container } = await render(Harness, { productId: 'p1' })
	await expect.element(vpage.getByText('Page 1 of 6')).toBeInTheDocument()
	for (let i = 0; i < 5; i++) {
		await vpage.getByRole('button', { name: 'Next page' }).click()
	}
	// Page index 5 (0-indexed) is the last of 6 pages — displayed as "Page 6 of 6".
	await expect.element(vpage.getByText('Page 6 of 6')).toBeInTheDocument()
	await expect.element(vpage.getByRole('button', { name: 'Next page' })).toBeDisabled()
})
