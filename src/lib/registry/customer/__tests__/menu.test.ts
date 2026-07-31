import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import Harness from './menu-harness.svelte'

test('Menu > Trigger > Content > Item(href) composition opens and renders composed links', async () => {
	await render(Harness)
	await page.getByRole('button', { name: 'Account' }).click()
	// bits-ui gives the composed `<a>` role="menuitem" (not "link"), since it's rendered inside a
	// menu — so query by that role rather than the implicit anchor role.
	const orders = page.getByRole('menuitem', { name: 'Orders' })
	const profile = page.getByRole('menuitem', { name: 'Profile' })
	await expect.element(orders).toBeInTheDocument()
	await expect.element(orders).toHaveAttribute('href', '/account/orders')
	await expect.element(profile).toBeInTheDocument()
	await expect.element(profile).toHaveAttribute('href', '/account/profile')
})
