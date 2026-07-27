import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi } from 'vitest'

const h = vi.hoisted(() => ({
	getReviewSummary: vi.fn(
		(_a?: Record<string, unknown>) =>
			({ current: { average: 4, count: 1, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 } } }) as any
	),
	getReviews: vi.fn(
		(_a?: Record<string, unknown>) =>
			({
				current: {
					reviews: [{ id: 'r1', rating: 5, body: 'b', author_name: 'Alice', created_at: '2026-01-01' }],
					count: 1
				}
			}) as any
	),
	reviewForm: {} as any
}))
vi.mock('sveltekit-medusa-sdk/reviews', () => ({
	getReviewSummary: h.getReviewSummary,
	getReviews: h.getReviews,
	reviewForm: h.reviewForm
}))

import Harness from './reviews-pushreview-harness.svelte'

test('exposes productId and prepends pushed reviews (deduped by id)', async () => {
	const { container } = await render(Harness, { productId: 'p1' })
	expect(container.querySelector('[data-pid]')?.textContent).toBe('p1')
	expect(container.querySelector('[data-authors]')?.textContent).toBe('Alice')
	await vpage.getByText('push').click()
	expect(container.querySelector('[data-authors]')?.textContent).toBe('Zoe,Alice')
})

test('a pushed review already present in the list is not duplicated', async () => {
	h.getReviews.mockReturnValue({
		current: {
			reviews: [{ id: 'new1', rating: 5, body: 'Fresh', author_name: 'Zoe', created_at: '2026-03-01' }],
			count: 1
		}
	})
	const { container } = await render(Harness, { productId: 'p1' })
	await vpage.getByText('push').click()
	expect(container.querySelector('[data-authors]')?.textContent).toBe('Zoe') // once, not "Zoe,Zoe"
})
