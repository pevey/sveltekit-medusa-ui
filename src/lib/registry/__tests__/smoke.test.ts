import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Button from '$lib/components/ui/button/button.svelte'

test('browser harness renders a Svelte component', async () => {
	render(Button, {})
	await expect.element(page.getByRole('button')).toBeInTheDocument()
})
