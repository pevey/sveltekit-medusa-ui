import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import Harness from './harness.svelte'

test('trigger renders the image with its alt', async () => {
	await render(Harness, {})
	await expect.element(page.getByRole('img', { name: 'img 1' })).toBeInTheDocument()
})

test('clicking a trigger opens the zoom dialog overlay', async () => {
	await render(Harness, {})
	await page.getByRole('img', { name: 'img 1' }).click()
	await expect.element(page.getByRole('dialog')).toBeInTheDocument()
})
