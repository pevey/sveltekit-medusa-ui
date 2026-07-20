import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Gallery2 from '../gallery2.svelte'

const urls = ['https://x/a.jpg', 'https://x/b.jpg']

// Desktop >= md so the layout matches gallery1's a11y-tree expectations.
const DESKTOP: [number, number] = [1024, 768]

test('renders the gallery images', async () => {
	await page.viewport(...DESKTOP)
	render(Gallery2, { images: urls, alt: 'P' })
	await expect.element(page.getByRole('img', { name: 'P' }).first()).toBeInTheDocument()
	expect(page.getByRole('img', { name: 'P' }).elements().length).toBeGreaterThanOrEqual(2)
})

test('clicking the main image opens the zoom overlay', async () => {
	await page.viewport(...DESKTOP)
	render(Gallery2, { images: urls, alt: 'P' })
	await page.getByRole('img', { name: 'P' }).first().click()
	await expect.element(page.getByRole('dialog')).toBeInTheDocument()
})
