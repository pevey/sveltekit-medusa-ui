import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import ThemeSwitch from '../theme-switch.svelte'
import ThemeSelect from '../theme-select.svelte'

// Minimal RemoteFormField mock — only the methods our components call.
function mockField(name = 'pref') {
	return {
		as: (type: string) => ({ name, type }),
		issues: () => undefined,
		value: () => '',
		set: () => {},
		touched: () => false,
		dirty: () => false
	} as any
}

test('ThemeSwitch: with `field`, renders a hidden native checkbox carrying the binding name', async () => {
	render(ThemeSwitch, { field: mockField('darkMode') })
	const hidden = document.querySelector('input.sr-only') as HTMLInputElement
	expect(hidden).not.toBeNull()
	expect(hidden.getAttribute('name')).toBe('darkMode')
	expect(hidden.getAttribute('type')).toBe('checkbox')
})

test('ThemeSwitch: without `field`, renders no hidden input', async () => {
	render(ThemeSwitch, {})
	expect(document.querySelector('input.sr-only')).toBeNull()
})

test('ThemeSelect: with `field`, renders a hidden native input carrying the binding name', async () => {
	render(ThemeSelect, { field: mockField('theme') })
	const hidden = document.querySelector('input.sr-only') as HTMLInputElement
	expect(hidden).not.toBeNull()
	expect(hidden.getAttribute('name')).toBe('theme')
})

test('ThemeSelect: without `field`, renders no hidden input', async () => {
	render(ThemeSelect, {})
	expect(document.querySelector('input.sr-only')).toBeNull()
})
