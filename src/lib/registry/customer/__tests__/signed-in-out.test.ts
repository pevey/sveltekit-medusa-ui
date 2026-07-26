import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

// The real `getCustomer` is a remote query: calling it returns a value that is BOTH awaitable
// (resolves to the customer) AND carries `.refresh()`/`.current`. Mock it as a Promise-with-refresh.
const h = vi.hoisted(() => ({ customer: null as any, refresh: vi.fn(async () => {}) }))
vi.mock('sveltekit-medusa-sdk/customer', () => ({
	getCustomer: () =>
		Object.assign(Promise.resolve(h.customer), { refresh: h.refresh, current: h.customer })
}))

import Harness from './signed-in-out-harness.svelte'

beforeEach(() => {
	h.customer = null
	h.refresh.mockClear()
})

test('signed-in customer: SignedIn renders children, SignedOut does not', async () => {
	h.customer = { id: 'cus_1' }
	render(Harness)
	await expect.element(page.getByTestId('signed-in')).toBeInTheDocument()
	await expect
		.element(page.getByTestId('signed-out'))
		.not.toBeInTheDocument()
		.catch(() => {})
	expect(document.querySelector('[data-testid=signed-out]')).toBeNull()
})

test('no customer: SignedOut renders children, SignedIn does not', async () => {
	h.customer = null
	render(Harness)
	await expect.element(page.getByTestId('signed-out')).toBeInTheDocument()
	expect(document.querySelector('[data-testid=signed-in]')).toBeNull()
})
