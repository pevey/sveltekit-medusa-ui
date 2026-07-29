import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import Harness from './reviews-summary-harness.svelte'

const summary = { average: 4.2, count: 10, distribution: { 1: 0, 2: 1, 3: 1, 4: 3, 5: 5 } }

test('renders average, stars and count when the summary has reviews', async () => {
	const { container } = await render(Harness, { summary, count: summary.count })
	await expect.element(page.getByText('Customer Reviews')).toBeInTheDocument()
	await expect.element(page.getByText('4.2')).toBeInTheDocument()
	await expect.element(page.getByText('10 reviews')).toBeInTheDocument()
	expect(container.querySelectorAll('svg').length).toBe(5)
	expect(container.querySelector('[data-product-reviews-summary]')).not.toBeNull()
})

test('renders nothing when the summary count is 0', async () => {
	const empty = { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
	const { container } = await render(Harness, { summary: empty, count: 0 })
	expect(container.querySelector('[data-product-reviews-summary]')).toBeNull()
	expect(container.querySelector('svg')).toBeNull()
	expect(container.textContent).not.toContain('reviews')
})
