import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import Harness from './main-harness.svelte'

const urls = ['https://x/a-white.jpg', 'https://x/b-white.jpg', 'https://x/c-gray.jpg']

test('Root normalizes images and Image repeats one per item', async () => {
	await render(Harness, { images: urls, alt: 'P' })
	await expect.element(page.getByRole('img', { name: 'P' }).first()).toBeInTheDocument()
	expect(page.getByRole('img', { name: 'P' }).elements().length).toBe(3)
})

test('filterString keeps matches (2) and falls back to all when none match', async () => {
	await render(Harness, { images: urls, alt: 'P', filterString: 'white' })
	expect(page.getByRole('img', { name: 'P' }).elements().length).toBe(2)
})

test('per-part class merges onto Image items', async () => {
	await render(Harness, { images: urls, alt: 'P', imageClass: 'object-cover' })
	const img = page.getByRole('img', { name: 'P' }).first().element()
	expect(getComputedStyle(img).objectFit).toBe('cover')
})
