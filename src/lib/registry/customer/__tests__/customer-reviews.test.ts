import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

// `getMyReviews` is a remote query: calling it returns a value that is BOTH awaitable
// (resolves to `{ reviews, count }`, consumed by the Root's `$derived(await ...)`) AND carries
// `.refresh()`/`.current` — same mocking approach as `customer/__tests__/signed-in-out.test.ts`.
const h = vi.hoisted(() => ({
	reviews: [] as any[],
	count: 0,
	refresh: vi.fn(async () => {}),
	deleteReview: vi.fn(async () => ({}) as any)
}))
vi.mock('sveltekit-medusa-sdk/reviews', async (orig) => ({
	...(await orig<Record<string, unknown>>()),
	getMyReviews: (_args?: Record<string, unknown>) =>
		Object.assign(Promise.resolve({ reviews: h.reviews, count: h.count }), {
			refresh: h.refresh,
			current: { reviews: h.reviews, count: h.count }
		}),
	deleteReview: h.deleteReview
}))

import Harness from './customer-reviews-harness.svelte'

const reviews = [
	{
		id: 'r1',
		rating: 5,
		title: 'Great',
		body: 'Loved it',
		author_name: 'Alice',
		created_at: '2026-01-01',
		product_id: 'p1',
		product: { title: 'Widget', handle: 'widget' }
	},
	{
		id: 'r2',
		rating: 3,
		title: 'Okay',
		body: 'Meh',
		author_name: 'Bob',
		created_at: '2026-02-01',
		product_id: 'p2',
		product: { title: 'Gadget', handle: 'gadget' }
	}
]

beforeEach(() => {
	h.reviews = reviews
	h.count = 2
	h.refresh.mockClear()
	h.deleteReview.mockClear()
	h.deleteReview.mockResolvedValue({})
})

test('renders rows from getMyReviews through the shared List/Review, incl. the product link', async () => {
	const { container } = await render(Harness)
	await expect.element(vpage.getByText('Alice')).toBeInTheDocument()
	await expect.element(vpage.getByText('Bob')).toBeInTheDocument()
	await expect.element(vpage.getByText('Loved it')).toBeInTheDocument()
	await expect.element(vpage.getByText('Widget')).toBeInTheDocument()
	await expect.element(vpage.getByText('Gadget')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-review]').length).toBe(2)
})

test('clicking Delete calls deleteReview with the row\'s product_id + id, then refreshes the list', async () => {
	await render(Harness)
	// Rows render in `ctx.reviews` order (r1 first) — target the first row's Delete button.
	await vpage.getByRole('button', { name: 'Delete' }).first().click()
	expect(h.deleteReview).toHaveBeenCalledWith({ productId: 'p1', reviewId: 'r1' })
	expect(h.refresh).toHaveBeenCalled()
})

test('renders nothing when the customer has no reviews', async () => {
	h.reviews = []
	h.count = 0
	const { container } = await render(Harness)
	expect(container.querySelector('[data-review]')).toBeNull()
})

test('does not mutate the shared reviews-core Review singleton also used by Reviews.Review', async () => {
	// Regression guard: `Customer.Reviews.Review` is assembled by `Object.assign`-ing
	// `Product`/`Edit`/`Delete` (plus the read-only core parts) onto a FRESH `customer-review.svelte`
	// wrapper — never onto the shared `Review` (from `../reviews/index.js`, itself re-exported from
	// `../review/index.js`) itself. If that ever regresses back to mutating the singleton,
	// `Reviews.Review` (the exact same object reference, also consumed by `reviews/index.ts`
	// consumers) would silently gain these customer-only parts too.
	const [Customer, Reviews] = await Promise.all([import('../index.js'), import('../../reviews/index.js')])
	expect(Customer.Reviews.Review.Delete).toBeDefined()
	expect(Customer.Reviews.Review.Edit).toBeDefined()
	expect(Customer.Reviews.Review.Product).toBeDefined()
	expect((Reviews.Review as any).Delete).toBeUndefined()
	expect((Reviews.Review as any).Edit).toBeUndefined()
	expect((Reviews.Review as any).Product).toBeUndefined()
	// Sanity: the core Review parts are untouched/still present.
	expect(Reviews.Review.Rating).toBeDefined()
})

test('Customer.Reviews.Review is directly callable as a bare tag, like Reviews.Review', async () => {
	const Customer = await import('../index.js')
	expect(typeof Customer.Reviews.Review).toBe('function')
})
