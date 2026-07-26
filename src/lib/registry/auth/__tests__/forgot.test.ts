import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

// Fake the SDK remote the component imports directly. `requestResetPassword.enhance` captures
// the submit handler so the test can drive it; the test's `submit` sets the result; fields are
// minimal accessors. Unlike login/register, forgot never touches `getCustomer` — there is no
// session yet — so only the auth remote needs mocking.
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string) => ({ name, type: t }),
		issues: () => undefined,
		value: () => '',
		set: () => {}
	})
	const forgot: any = {
		pending: 0,
		result: undefined,
		cb: null,
		fields: { email: field('email') },
		enhance(callback: any) {
			forgot.cb = callback
			return { method: 'POST', action: '' }
		},
		submit: vi.fn(async () => true)
	}
	return { forgot }
})

vi.mock('sveltekit-medusa-sdk/auth', () => ({ requestResetPassword: h.forgot }))

import Harness from './forgot-harness.svelte'

beforeEach(() => {
	h.forgot.result = undefined
	h.forgot.cb = null
	h.forgot.pending = 0
})

test('successful request fires onsuccess', async () => {
	h.forgot.submit = vi.fn(async () => {
		h.forgot.result = { ok: true }
		return true
	})
	const onsuccess = vi.fn()
	render(Harness, { onsuccess })
	await h.forgot.cb({ submit: h.forgot.submit })
	expect(h.forgot.submit).toHaveBeenCalled()
	expect(onsuccess).toHaveBeenCalled()
})
