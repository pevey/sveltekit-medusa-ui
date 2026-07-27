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
import Harness from './reviews-summary-harness.svelte'

const summary = { average: 4, count: 37, distribution: { 1: 1, 2: 2, 3: 4, 4: 10, 5: 20 } }

test('renders title, count, average stars and 5 histogram bars', async () => {
	h.getReviewSummary.mockReturnValue({ current: summary })
	const { container } = await render(Harness, { productId: 'p1' })
	await expect.element(vpage.getByText('Customer Reviews')).toBeInTheDocument()
	await expect.element(vpage.getByText('37 reviews')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-histogram-bar]').length).toBe(5)
})

test('renders nothing when count is 0', async () => {
	h.getReviewSummary.mockReturnValue({
		current: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
	})
	const { container } = await render(Harness, { productId: 'p1' })
	expect(container.querySelector('[data-product-reviews-summary]')).toBeNull()
})

test('clicking a bar filters getReviews to that rating, clicking again clears', async () => {
	h.getReviewSummary.mockReturnValue({ current: summary })
	await render(Harness, { productId: 'p1' })
	const bar5 = vpage.getByLabelText('Show 5-star reviews') // level 5 first
	await bar5.click()
	await expect
		.poll(() => h.getReviews.mock.calls.at(-1)?.[0]?.rating)
		.toBe(5)
	expect(h.getReviews.mock.calls.at(-1)?.[0]).toMatchObject({ rating: 5 })
	await bar5.click()
	await expect
		.poll(() => h.getReviews.mock.calls.at(-1)?.[0]?.rating)
		.toBeUndefined()
})
