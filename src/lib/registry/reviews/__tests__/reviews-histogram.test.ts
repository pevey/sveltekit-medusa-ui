import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi } from 'vitest'
import Harness from './reviews-histogram-harness.svelte'

const summary = { average: 4.2, count: 10, distribution: { 1: 0, 2: 1, 3: 1, 4: 3, 5: 5 } }

test('renders 5 level rows, most-starred first', async () => {
	const { container } = await render(Harness, {
		summary,
		count: summary.count,
		setRating: vi.fn()
	})
	const bars = container.querySelectorAll('[data-histogram-bar]')
	expect(bars.length).toBe(5)
	expect(container.querySelector('[data-histogram]')).not.toBeNull()
	await expect.element(page.getByText('5 star')).toBeInTheDocument()
	await expect.element(page.getByText('1 star')).toBeInTheDocument()
})

test('clicking a level row calls setRating with that level', async () => {
	const setRating = vi.fn()
	await render(Harness, { summary, count: summary.count, setRating })
	await page.getByRole('button', { name: 'Show 4-star reviews' }).click()
	expect(setRating).toHaveBeenCalledWith(4)
	expect(setRating).toHaveBeenCalledTimes(1)
})

test('marks the active level from ctx.rating', async () => {
	const { container } = await render(Harness, {
		summary,
		count: summary.count,
		rating: 5,
		setRating: vi.fn()
	})
	const active = container.querySelector('[data-histogram-bar][data-active="true"]')
	expect(active).not.toBeNull()
	expect(active?.getAttribute('aria-label')).toBe('Show 5-star reviews')
})

test('renders nothing when there are no reviews', async () => {
	const empty = { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
	const { container } = await render(Harness, { summary: empty, count: 0, setRating: vi.fn() })
	expect(container.querySelector('[data-histogram]')).toBeNull()
	expect(container.querySelectorAll('[data-histogram-bar]').length).toBe(0)
})
