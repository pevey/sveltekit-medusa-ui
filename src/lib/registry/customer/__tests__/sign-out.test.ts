import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

const h = vi.hoisted(() => ({
	customer: null as any,
	refresh: vi.fn(async () => {}),
	logout: vi.fn(async () => {})
}))
vi.mock('sveltekit-medusa-sdk/customer', () => ({
	getCustomer: () => Object.assign(Promise.resolve(h.customer), { refresh: h.refresh, current: h.customer })
}))
vi.mock('sveltekit-medusa-sdk/auth', () => ({ logout: h.logout }))

import Harness from './sign-out-harness.svelte'

beforeEach(() => {
	h.refresh.mockClear()
	h.logout.mockClear()
})

test('clicking sign out logs out, refreshes the customer, and fires onsignout', async () => {
	const onsignout = vi.fn()
	render(Harness, { onsignout })
	await page.getByRole('button', { name: 'Sign out' }).click()
	expect(h.logout).toHaveBeenCalled()
	expect(h.refresh).toHaveBeenCalled()
	expect(onsignout).toHaveBeenCalled()
})
