import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import SignInButton from '../sign-in-button.svelte'

test('renders an anchor deep-linking into the auth dialog', async () => {
	render(SignInButton)
	const link = page.getByRole('link', { name: 'Sign in' })
	await expect.element(link).toBeInTheDocument()
	await expect.element(link).toHaveAttribute('href', '?auth=login')
})
