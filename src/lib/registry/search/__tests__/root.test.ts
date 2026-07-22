import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Harness from './root-harness.svelte'

test('Root provides SearchState context to children', async () => {
	render(Harness)
	await expect.element(page.getByTestId('state')).toHaveTextContent('closed')
})

test('clicking outside closes (open -> closed)', async () => {
	render(Harness)
	await page.getByTestId('open').click()
	await expect.element(page.getByTestId('state')).toHaveTextContent('open')
	await page.getByTestId('outside').click()
	await expect.element(page.getByTestId('state')).toHaveTextContent('closed')
})
