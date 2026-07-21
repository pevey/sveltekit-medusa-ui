import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import InputSelectCountry from '../input-select-country.svelte'

function mockField() {
	return { as: (t: string) => ({ name: 'country_code', type: t }), issues: () => undefined, value: () => '', set: vi.fn(), touched: () => false, dirty: () => false } as any
}
const COUNTRIES = [{ code: 'us', name: 'United States' }, { code: 'ca', name: 'Canada' }]

test('renders an option per country (value=code, text=name) and binds the field', async () => {
	render(InputSelectCountry, { field: mockField(), countries: COUNTRIES, label: 'Country' })
	const select = document.querySelector('select') as HTMLSelectElement
	expect(select.getAttribute('name')).toBe('country_code')
	const opts = Array.from(select.querySelectorAll('option'))
	expect(opts.map((o) => o.value)).toEqual(['us', 'ca'])
	expect(opts.map((o) => o.textContent)).toEqual(['United States', 'Canada'])
})

test('bubbles the native change event', async () => {
	const onchange = vi.fn()
	render(InputSelectCountry, { field: mockField(), countries: COUNTRIES, onchange })
	const select = document.querySelector('select') as HTMLSelectElement
	select.value = 'ca'
	select.dispatchEvent(new Event('change', { bubbles: true }))
	await vi.waitFor(() => expect(onchange).toHaveBeenCalled())
})
