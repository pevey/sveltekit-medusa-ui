import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import SubcomponentHarness from './reviews-list-subcomponent-harness.svelte'
import SnippetHarness from './reviews-list-snippet-harness.svelte'

const reviews = [
	{
		id: 'r1',
		rating: 5,
		title: 'Great',
		body: 'Loved it',
		author_name: 'Alice',
		created_at: '2026-01-01'
	},
	{ id: 'r2', rating: 3, title: 'Okay', body: 'Meh', author_name: 'Bob', created_at: '2026-02-01' }
]

test('subcomponent mode: <Reviews.List><Review>…</Review></Reviews.List> renders one row per review', async () => {
	const { container } = await render(SubcomponentHarness, { reviews })
	await expect.element(page.getByText('Alice')).toBeInTheDocument()
	await expect.element(page.getByText('Bob')).toBeInTheDocument()
	await expect.element(page.getByText('Loved it')).toBeInTheDocument()
	await expect.element(page.getByText('Meh')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-review]').length).toBe(2)
})

test("subcomponent mode sets per-item context: Review.Rating inside <Review> renders that row's stars", async () => {
	const { container } = await render(SubcomponentHarness, { reviews })
	// ratingToStarFills always yields 5 stars per row, regardless of rating.
	expect(container.querySelectorAll('svg').length).toBe(reviews.length * 5)
})

test('per-item snippet mode: children({ review }) renders raw content per row, no <Review> needed', async () => {
	const { container } = await render(SnippetHarness, { reviews })
	await expect.element(page.getByText('Alice says: Loved it')).toBeInTheDocument()
	await expect.element(page.getByText('Bob says: Meh')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-raw-row]').length).toBe(2)
	// The snippet mode never wraps rows in the `Review` atom's own container.
	expect(container.querySelectorAll('[data-review]').length).toBe(0)
})

test('renders nothing when the review list is empty', async () => {
	const { container } = await render(SubcomponentHarness, { reviews: [] })
	expect(container.querySelector('[data-review-list]')).toBeNull()
	expect(container.querySelector('[data-review]')).toBeNull()
})
