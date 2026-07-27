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

import Harness from './reviews-list-harness.svelte'

const reviews = [
	{ id: 'r1', rating: 5, title: 'Great', body: 'Loved it', author_name: 'Alice', created_at: '2026-01-01' },
	{ id: 'r2', rating: 3, title: 'Okay', body: 'Meh', author_name: 'Bob', created_at: '2026-02-01' }
]

test('renders each review with its own data (per-item context)', async () => {
	h.getReviewSummary.mockReturnValue({ current: { average: 4, count: 2, distribution: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 1 } } })
	h.getReviews.mockReturnValue({ current: { reviews, count: 2 } })
	const { container } = await render(Harness, { productId: 'p1' })
	await expect.element(vpage.getByText('Alice')).toBeInTheDocument()
	await expect.element(vpage.getByText('Bob')).toBeInTheDocument()
	await expect.element(vpage.getByText('Loved it')).toBeInTheDocument()
	await expect.element(vpage.getByText('Meh')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-review]').length).toBe(2)
})

test('renders nothing when the page is empty', async () => {
	h.getReviewSummary.mockReturnValue({ current: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } })
	h.getReviews.mockReturnValue({ current: { reviews: [], count: 0 } })
	const { container } = await render(Harness, { productId: 'p1' })
	expect(container.querySelector('[data-review]')).toBeNull()
})
