import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import SignIn from '../sign-in.svelte'
import SignInChildHarness from './sign-in-child-harness.svelte'

test('renders a finished button anchor deep-linking into the auth dialog', async () => {
	const { container } = await render(SignIn)
	const link = page.getByRole('link', { name: 'Sign In' })
	await expect.element(link).toBeInTheDocument()
	await expect.element(link).toHaveAttribute('href', '?auth=login')
	// Default branch carries the button styling.
	expect(container.querySelector('[data-customer-sign-in]')?.className).toContain('bg-primary')
})

test('a child gets no button styling forced onto it', async () => {
	const { container } = await render(SignInChildHarness)
	const link = container.querySelector('[data-customer-sign-in]')!
	expect(link.getAttribute('href')).toBe('?auth=login')
	expect(link.className).not.toContain('bg-primary')
	expect(link.querySelector('[data-testid="child"]')).not.toBeNull()
})
