import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

// Fake the SDK remotes the component imports directly. All test scaffolding lives here —
// the component stays free of injection props. `register.enhance` captures the submit handler
// so the test can drive it; the test's `submit` sets `register.result`; fields are minimal
// accessors.
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string) => ({ name, type: t }),
		issues: () => undefined,
		value: () => '',
		set: () => {}
	})
	const register: any = {
		pending: 0,
		result: undefined,
		cb: null,
		fields: { email: field('email'), password: field('password') },
		enhance(callback: any) {
			register.cb = callback
			return { method: 'POST', action: '' }
		},
		submit: vi.fn(async () => true)
	}
	return { register, refresh: vi.fn(async () => {}) }
})

vi.mock('sveltekit-medusa-sdk/auth', () => ({ register: h.register }))
vi.mock('sveltekit-medusa-sdk/customer', () => ({
	getCustomer: () => ({ current: null, refresh: h.refresh })
}))

import Harness from './register-harness.svelte'

beforeEach(() => {
	h.register.result = undefined
	h.register.cb = null
	h.register.pending = 0
	h.refresh.mockClear()
})

test('successful register refreshes the customer then fires onsuccess', async () => {
	h.register.submit = vi.fn(async () => {
		h.register.result = { ok: true }
		return true
	})
	const onsuccess = vi.fn()
	render(Harness, { onsuccess })
	await h.register.cb({ submit: h.register.submit })
	expect(h.register.submit).toHaveBeenCalled()
	expect(h.refresh).toHaveBeenCalled()
	expect(onsuccess).toHaveBeenCalled()
})

test('failed register shows the mapped error copy and fires onerror', async () => {
	h.register.submit = vi.fn(async () => {
		h.register.result = { ok: false, code: 'email_exists' }
		return true
	})
	const onerror = vi.fn()
	render(Harness, { onerror })
	await h.register.cb({ submit: h.register.submit })
	await expect.element(page.getByText('An account with that email already exists.')).toBeInTheDocument()
	expect(onerror).toHaveBeenCalledWith({ ok: false, code: 'email_exists' })
})
