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

import Harness from './reviews-root-harness.svelte'

const summary = { average: 4, count: 37, distribution: { 1: 1, 2: 2, 3: 4, 4: 10, 5: 20 } }
const list = { reviews: [{ id: 'r1', rating: 5, body: 'b', author_name: 'A', created_at: '2026-01-01' }], count: 37 }

test('exposes summary count + reviews and default state', async () => {
	h.getReviewSummary.mockReturnValue({ current: summary })
	h.getReviews.mockReturnValue({ current: list })
	const { container } = await render(Harness, { productId: 'p1', pageSize: 10 })
	expect(container.querySelector('[data-count]')?.textContent).toBe('37')
	expect(container.querySelector('[data-order]')?.textContent).toBe('-created_at')
	expect(container.querySelector('[data-reviews]')?.textContent).toBe('1')
})

test('setRating passes rating into getReviews args and resets page', async () => {
	h.getReviewSummary.mockReturnValue({ current: summary })
	h.getReviews.mockReturnValue({ current: list })
	await render(Harness, { productId: 'p1', pageSize: 10 })
	await vpage.getByText('next').click() // page -> 1
	await vpage.getByText('r5').click() // rating -> 5, page resets to 0
	// last getReviews call includes rating 5 and offset 0
	const lastArgs = h.getReviews.mock.calls.at(-1)?.[0]
	expect(lastArgs).toMatchObject({ productId: 'p1', rating: 5, offset: 0, limit: 10 })
})

test('setRating(active) toggles the filter off', async () => {
	h.getReviewSummary.mockReturnValue({ current: summary })
	h.getReviews.mockReturnValue({ current: list })
	const { container } = await render(Harness, { productId: 'p1', pageSize: 10 })
	await vpage.getByText('r5').click() // set 5
	await vpage.getByText('clear').click() // same value -> clear
	expect(container.querySelector('[data-rating]')?.textContent).toBe('null')
})
