import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

// Fake the SDK remotes the component imports directly. All test scaffolding lives here —
// the component stays free of injection props. `login.enhance` captures the submit handler so
// the test can drive it; the test's `submit` sets `login.result`; fields are minimal accessors.
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string) => ({ name, type: t }),
		issues: () => undefined,
		value: () => '',
		set: () => {}
	})
	const login: any = {
		pending: 0,
		result: undefined,
		cb: null,
		fields: { email: field('email'), password: field('password') },
		enhance(callback: any) {
			login.cb = callback
			return { method: 'POST', action: '' }
		},
		submit: vi.fn(async () => true)
	}
	return { login, refresh: vi.fn(async () => {}) }
})

vi.mock('sveltekit-medusa-sdk/auth', () => ({ login: h.login }))
vi.mock('sveltekit-medusa-sdk/customer', () => ({
	getCustomer: () => ({ current: null, refresh: h.refresh })
}))

import Harness from './login-harness.svelte'

beforeEach(() => {
	h.login.result = undefined
	h.login.cb = null
	h.login.pending = 0
	h.refresh.mockClear()
})

test('successful login refreshes the customer then fires onsuccess', async () => {
	h.login.submit = vi.fn(async () => {
		h.login.result = { ok: true }
		return true
	})
	const onsuccess = vi.fn()
	render(Harness, { onsuccess })
	await h.login.cb({ submit: h.login.submit })
	expect(h.login.submit).toHaveBeenCalled()
	expect(h.refresh).toHaveBeenCalled()
	expect(onsuccess).toHaveBeenCalled()
})

test('failed login shows the mapped error copy and fires onerror', async () => {
	h.login.submit = vi.fn(async () => {
		h.login.result = { ok: false, code: 'invalid_credentials' }
		return true
	})
	const onerror = vi.fn()
	render(Harness, { onerror })
	await h.login.cb({ submit: h.login.submit })
	await expect.element(page.getByText('Invalid email or password.')).toBeInTheDocument()
	expect(onerror).toHaveBeenCalledWith({ ok: false, code: 'invalid_credentials' })
})
