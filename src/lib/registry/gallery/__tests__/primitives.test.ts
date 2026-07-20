import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Harness from './main-harness.svelte'

const urls = ['https://x/a-white.jpg', 'https://x/b-white.jpg', 'https://x/c-gray.jpg']

test('Root normalizes images and Image repeats one per item', async () => {
	render(Harness, { images: urls, alt: 'P' })
	await expect.element(page.getByRole('img', { name: 'P' }).first()).toBeInTheDocument()
	expect(page.getByRole('img', { name: 'P' }).elements().length).toBe(3)
})

test('filterString keeps matches (2) and falls back to all when none match', async () => {
	render(Harness, { images: urls, alt: 'P', filterString: 'white' })
	expect(page.getByRole('img', { name: 'P' }).elements().length).toBe(2)
})

test('per-part class merges onto Image items', async () => {
	render(Harness, { images: urls, alt: 'P', imageClass: 'object-cover' })
	const img = page.getByRole('img', { name: 'P' }).first().element()
	expect(getComputedStyle(img).objectFit).toBe('cover')
})

test('renders a thumbnail button per image', async () => {
	render(Harness, { images: urls, alt: 'P', thumbnails: true })
	expect(page.getByRole('button', { name: /View image/ }).elements().length).toBe(3)
})

test('clicking a thumbnail marks it current (main↔thumb sync)', async () => {
	render(Harness, { images: urls, alt: 'P', thumbnails: true })
	await page.getByRole('button', { name: 'View image 2' }).click()
	await expect
		.element(page.getByRole('button', { name: 'View image 2' }))
		.toHaveAttribute('aria-current', 'true')
})

test('renders a dot per image when there is more than one', async () => {
	render(Harness, { images: urls, alt: 'P', dots: true })
	expect(page.getByRole('button', { name: /Go to image/ }).elements().length).toBe(3)
})

test('renders no dots for a single image', async () => {
	render(Harness, { images: [urls[0]], alt: 'P', dots: true })
	expect(page.getByRole('button', { name: /Go to image/ }).elements().length).toBe(0)
})
