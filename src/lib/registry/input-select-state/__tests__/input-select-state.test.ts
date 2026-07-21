import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import InputSelectState from '../input-select-state.svelte'

function mockField() {
	return { as: (t: string) => ({ name: 'province', type: t }), issues: () => undefined, value: () => '', set: vi.fn(), touched: () => false, dirty: () => false } as any
}

test('renders the ISO 3166-2 US list (value us-ca / label California present) and binds the field', async () => {
	render(InputSelectState, { field: mockField(), label: 'State' })
	const select = document.querySelector('select') as HTMLSelectElement
	expect(select.getAttribute('name')).toBe('province')
	const ca = Array.from(select.querySelectorAll('option')).find((o) => o.value === 'us-ca')
	expect(ca).toBeTruthy()
	expect(ca!.textContent).toBe('California')
	// 50 states + DC + 5 territories = 56 (no Armed Forces / APO-FPO)
	expect(select.querySelectorAll('option').length).toBe(56)
})

test('bubbles the native change event', async () => {
	const onchange = vi.fn()
	render(InputSelectState, { field: mockField(), onchange })
	const select = document.querySelector('select') as HTMLSelectElement
	select.value = 'us-ny'
	select.dispatchEvent(new Event('change', { bubbles: true }))
	await vi.waitFor(() => expect(onchange).toHaveBeenCalled())
})
