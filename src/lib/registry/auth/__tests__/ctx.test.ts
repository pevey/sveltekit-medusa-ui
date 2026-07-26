import { expect, test } from 'vitest'
import { resolveMessage, loginMessages } from '$lib/components/ui/auth/auth-messages.js'

test('resolveMessage maps a known code, else falls back to unknown', () => {
	expect(resolveMessage(loginMessages, 'invalid_credentials')).toBe('Invalid email or password.')
	expect(resolveMessage(loginMessages, 'nope')).toBe('Something went wrong. Please try again.')
	expect(resolveMessage(loginMessages, undefined)).toBe('Something went wrong. Please try again.')
})
