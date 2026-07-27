import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test } from 'vitest'
import Harness from './review-standalone-harness.svelte'

test('Review works standalone from a prop', async () => {
	const { container } = await render(Harness, {
		review: { id: 'r1', rating: 4, body: 'x', author_name: 'Carol', created_at: '2026-01-01' }
	})
	await expect.element(vpage.getByText('Carol')).toBeInTheDocument()
	expect(container.querySelectorAll('svg').length).toBe(5) // rating stars
})
