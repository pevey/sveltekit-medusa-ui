import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import Harness from './reviews-carousel-harness.svelte'

const reviews = [
	{ id: 'r1', rating: 5, title: 'Great', body: 'Loved it', author_name: 'Alice', created_at: '2026-01-01' },
	{ id: 'r2', rating: 3, title: 'Okay', body: 'Meh', author_name: 'Bob', created_at: '2026-02-01' },
	{ id: 'r3', rating: 4, title: 'Good', body: 'Nice', author_name: 'Carol', created_at: '2026-03-01' }
]

test('renders one slide per review through the shared Review.* atom', async () => {
	const { container } = await render(Harness, { reviews })
	await expect.element(page.getByText('Alice')).toBeInTheDocument()
	await expect.element(page.getByText('Bob')).toBeInTheDocument()
	await expect.element(page.getByText('Carol')).toBeInTheDocument()
	expect(container.querySelectorAll('[data-review]').length).toBe(3)
})

test('renders nothing when the review list is empty', async () => {
	const { container } = await render(Harness, { reviews: [] })
	expect(container.querySelectorAll('[data-review]').length).toBe(0)
})

test('class prop overrides the default slide basis on Carousel.Item', async () => {
	const { container } = await render(Harness, { reviews, class: 'basis-1/2' })
	const slides = container.querySelectorAll('[data-slot="carousel-item"]')
	expect(slides.length).toBe(3)
	for (const slide of slides) {
		expect(slide.className).toContain('basis-1/2')
		expect(slide.className).not.toContain('basis-full')
	}
})
