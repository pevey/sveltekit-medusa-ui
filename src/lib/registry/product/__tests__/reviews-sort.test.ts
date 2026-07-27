import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi } from 'vitest'

const h = vi.hoisted(() => ({
	getReviewSummary: vi.fn((_args?: Record<string, unknown>) => ({ current: undefined }) as any),
	getReviews: vi.fn((_args?: Record<string, unknown>) => ({ current: undefined }) as any)
}))
vi.mock('sveltekit-medusa-sdk/reviews', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getReviewSummary: h.getReviewSummary,
	getReviews: h.getReviews
}))

import Harness from './reviews-sort-harness.svelte'

test('changing the select updates order arg', async () => {
	h.getReviewSummary.mockReturnValue({ current: { average: 4, count: 5, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 5 } } })
	h.getReviews.mockReturnValue({ current: { reviews: [], count: 5 } })
	const { container } = await render(Harness, { productId: 'p1' })
	const select = container.querySelector('select') as HTMLSelectElement
	select.value = '-rating'
	select.dispatchEvent(new Event('change', { bubbles: true }))
	await expect.poll(() => h.getReviews.mock.calls.at(-1)?.[0]?.order).toBe('-rating')
})
