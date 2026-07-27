import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi } from 'vitest'

const h = vi.hoisted(() => ({ getReviewSummary: vi.fn(() => ({ current: undefined }) as any) }))
vi.mock('sveltekit-medusa-sdk/reviews', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getReviewSummary: h.getReviewSummary
}))

import Harness from './product-rating-harness.svelte'

test('renders stars and count when summary resolves', async () => {
	h.getReviewSummary.mockReturnValue({ current: { average: 4, count: 37, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } })
	const { container } = await render(Harness, { productId: 'prod_1' })
	await expect.element(vpage.getByText('(37)')).toBeInTheDocument()
	expect(container.querySelectorAll('svg').length).toBe(5)
})

test('renders nothing when count is 0', async () => {
	h.getReviewSummary.mockReturnValue({ current: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } })
	const { container } = await render(Harness, { productId: 'prod_1' })
	expect(container.querySelector('svg')).toBeNull()
})

test('renders nothing before resolve / on error', async () => {
	h.getReviewSummary.mockReturnValue({ current: undefined, error: new Error('x') })
	const { container } = await render(Harness, { productId: 'prod_1' })
	expect(container.querySelector('svg')).toBeNull()
})
