import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Harness from './icon-harness.svelte'

test('renders the default lucide search icon', async () => {
	render(Harness, { custom: false })
	expect(document.querySelector('svg')).toBeTruthy()
})

test('renders a custom icon snippet when provided', async () => {
	render(Harness, { custom: true })
	await expect.element(page.getByTestId('custom-icon')).toBeInTheDocument()
})
