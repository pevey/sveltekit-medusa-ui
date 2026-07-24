import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import InputProvince from '../input-province.svelte'
import { US_MILITARY } from '../provinces'

function mockField() {
	return { as: (t: string) => ({ name: 'province', type: t }), issues: () => undefined, value: () => '', set: vi.fn(), touched: () => false, dirty: () => false } as any
}

test('renders a state <select> when country is configured (us)', async () => {
	render(InputProvince, { field: mockField(), country: 'us' })
	const select = document.querySelector('select')
	expect(select).not.toBeNull()
	expect(Array.from(select!.querySelectorAll('option')).some((o) => o.value === 'us-ca')).toBe(true)
})

test('renders a freeform text input when country is unconfigured', async () => {
	render(InputProvince, { field: mockField(), country: 'gb' })
	expect(document.querySelector('select')).toBeNull()
	expect(document.querySelector('input')).not.toBeNull()
})

test('custom config with military options renders them', async () => {
	const config = { us: { label: 'State', options: US_MILITARY } }
	render(InputProvince, { field: mockField(), country: 'us', config })
	const values = Array.from(document.querySelectorAll('option')).map((o) => (o as HTMLOptionElement).value)
	expect(values).toContain('us-ap')
})
