import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import InputSelect from '../input-select.svelte'

function mockField(over: Record<string, unknown> = {}) {
	return {
		as: (type: string) => ({ name: 'country', type }),
		issues: () => undefined,
		value: () => '', set: () => {}, touched: () => false, dirty: () => false,
		...over
	} as any
}
const OPTIONS = [{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]

test('renders one <option> per option (plus placeholder) and binds the field name', async () => {
	render(InputSelect, { field: mockField(), options: OPTIONS, label: 'Country', placeholder: 'Select…' })
	const select = document.querySelector('select') as HTMLSelectElement
	expect(select.getAttribute('name')).toBe('country')
	const opts = Array.from(select.querySelectorAll('option')).map((o) => o.textContent)
	expect(opts).toEqual(['Select…', 'United States', 'Canada'])
})

test('fires the onchange passthrough', async () => {
	const onchange = vi.fn()
	render(InputSelect, { field: mockField(), options: OPTIONS, onchange })
	const select = document.querySelector('select') as HTMLSelectElement
	select.value = 'ca'
	select.dispatchEvent(new Event('change', { bubbles: true }))
	await vi.waitFor(() => expect(onchange).toHaveBeenCalled())
})

test('renders issue messages', async () => {
	render(InputSelect, { field: mockField({ issues: () => [{ message: 'Select a country' }] }), options: OPTIONS })
	await vi.waitFor(() =>
		expect(document.querySelector('[data-slot="field-error"]')?.textContent).toContain('Select a country')
	)
})
