import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Gallery1 from '../gallery1.svelte'
import BindHarness from './gallery1-bind-harness.svelte'

const urls = ['https://x/a-white.jpg', 'https://x/b-white.jpg', 'https://x/c-gray.jpg']

// Desktop >= md so the thumbnail rail (`hidden md:flex`) is in the a11y tree.
const DESKTOP: [number, number] = [1024, 768]
// Below md so the dot indicators (`flex md:hidden`) are in the a11y tree
// (and the thumbnail rail is hidden).
const MOBILE: [number, number] = [500, 800]

test('renders a thumbnail button per image (default bottom, desktop)', async () => {
	await page.viewport(...DESKTOP)
	render(Gallery1, { images: urls, alt: 'P' })
	await expect.element(page.getByRole('button', { name: 'View image 1' })).toBeInTheDocument()
	expect(page.getByRole('button', { name: /View image/ }).elements().length).toBe(3)
})

test('thumbnails="none" renders no thumbnail buttons', async () => {
	await page.viewport(...DESKTOP)
	render(Gallery1, { images: urls, thumbnails: 'none', alt: 'P' })
	expect(page.getByRole('button', { name: /View image/ }).elements().length).toBe(0)
})

test('clicking a thumbnail marks it current', async () => {
	await page.viewport(...DESKTOP)
	render(Gallery1, { images: urls, alt: 'P' })
	await page.getByRole('button', { name: 'View image 2' }).click()
	await expect
		.element(page.getByRole('button', { name: 'View image 2' }))
		.toHaveAttribute('aria-current', 'true')
})

test('renders a dot per image at a mobile viewport', async () => {
	await page.viewport(...MOBILE)
	render(Gallery1, { images: urls, alt: 'P' })
	await expect.element(page.getByRole('button', { name: 'Go to image 1' })).toBeInTheDocument()
	expect(page.getByRole('button', { name: /Go to image/ }).elements().length).toBe(3)
})

test('bind:selectedIndex updates after a thumbnail click', async () => {
	await page.viewport(...DESKTOP)
	render(BindHarness, { images: urls, alt: 'P' })
	await expect.element(page.getByTestId('selected')).toHaveTextContent('0')
	await page.getByRole('button', { name: 'View image 3' }).click()
	await expect.element(page.getByTestId('selected')).toHaveTextContent('2')
})

// Regression: default `bottom` thumbnails must render BELOW the main image.
test('bottom thumbnails render below the main image', async () => {
	await page.viewport(...DESKTOP)
	render(Gallery1, { images: urls, alt: 'P' })
	await expect.element(page.getByRole('button', { name: 'View image 1' })).toBeInTheDocument()
	const mainTop = page.getByRole('img', { name: 'P' }).first().element().getBoundingClientRect().top
	const thumbTop = page
		.getByRole('button', { name: 'View image 1' })
		.element()
		.getBoundingClientRect().top
	expect(thumbTop).toBeGreaterThan(mainTop)
})
