import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import Harness from './submit-harness.svelte'

test('submit button is type=submit and enabled when idle', () => {
	render(Harness, { submitting: false })
	const btn = document.querySelector('button')!
	expect(btn.getAttribute('type')).toBe('submit')
	expect(btn.disabled).toBe(false)
})
test('submit button disables while submitting', () => {
	render(Harness, { submitting: true })
	expect(document.querySelector('button')!.disabled).toBe(true)
})
