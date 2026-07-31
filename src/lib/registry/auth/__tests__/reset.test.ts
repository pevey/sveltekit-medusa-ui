import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

// Fake the SDK remote the component imports directly. `resetPassword.enhance` captures the
// submit handler so the test can drive it; `fields.token.set` is a spy so the test can confirm
// the hidden token field gets seeded from the `token` prop. Reset never touches `getCustomer` —
// there is no session yet — so only the auth remote needs mocking.
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string) => ({ name, type: t }),
		issues: () => undefined,
		value: () => '',
		set: () => {}
	})
	const reset: any = {
		pending: 0,
		result: undefined,
		cb: null,
		fields: { password: field('password'), token: field('token') },
		enhance(callback: any) {
			reset.cb = callback
			return { method: 'POST', action: '' }
		},
		submit: vi.fn(async () => true)
	}
	return { reset }
})

vi.mock('sveltekit-medusa-sdk/auth', () => ({ resetPassword: h.reset }))

import Harness from './reset-harness.svelte'

beforeEach(() => {
	h.reset.result = undefined
	h.reset.cb = null
	h.reset.pending = 0
})

test('renders the token as a hidden field under the form field name', async () => {
	await render(Harness, { token: 'tok_123' })
	const input = document.querySelector('input[type=hidden]') as HTMLInputElement
	expect(input?.name).toBe('token')
	expect(input?.value).toBe('tok_123')
})

test('successful reset fires onsuccess', async () => {
	h.reset.submit = vi.fn(async () => {
		h.reset.result = { ok: true }
		return true
	})
	const onsuccess = vi.fn()
	await render(Harness, { token: 'tok_123', onsuccess })
	await h.reset.cb({ submit: h.reset.submit })
	expect(h.reset.submit).toHaveBeenCalled()
	expect(onsuccess).toHaveBeenCalled()
})
