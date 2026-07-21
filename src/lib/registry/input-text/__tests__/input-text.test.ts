import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import InputText from '../input-text.svelte'

function mockField(over: Record<string, unknown> = {}) {
	return {
		as: (type: string) => ({ name: 'email', type }),
		issues: () => undefined,
		value: () => '', set: () => {}, touched: () => false, dirty: () => false,
		...over
	} as any
}

test('renders a label bound to the field name and a text input', async () => {
	render(InputText, { field: mockField(), label: 'Email', type: 'email' })
	const label = document.querySelector('label') as HTMLLabelElement
	const input = document.querySelector('input') as HTMLInputElement
	expect(label.textContent).toContain('Email')
	expect(input.getAttribute('name')).toBe('email')
	expect(label.getAttribute('for')).toBe('email')
	expect(input.getAttribute('id')).toBe('email')
})

test('type="textarea" renders a <textarea>', async () => {
	render(InputText, { field: mockField(), type: 'textarea' })
	expect(document.querySelector('textarea')).not.toBeNull()
})

test('type="password" renders a password input and the reveal button toggles it to text', async () => {
	render(InputText, { field: mockField(), type: 'password' })
	const input = () => document.querySelector('input') as HTMLInputElement
	expect(input().getAttribute('type')).toBe('password')
	const toggle = document.querySelector('button[aria-label="Show"]') as HTMLButtonElement
	toggle.click()
	await vi.waitFor(() => expect(input().getAttribute('type')).toBe('text'))
})

test('renders issue messages and marks the field invalid', async () => {
	render(InputText, { field: mockField({ issues: () => [{ message: 'Required' }] }), label: 'Email' })
	await vi.waitFor(() => {
		expect(document.querySelector('[data-slot="field-error"]')?.textContent).toContain('Required')
		expect(document.querySelector('[data-slot="field"]')?.getAttribute('data-invalid')).toBe('true')
	})
})
