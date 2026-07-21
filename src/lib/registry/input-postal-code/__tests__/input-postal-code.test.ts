import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import InputPostalCode from '../input-postal-code.svelte'

function mockField(set = vi.fn()) {
	return { as: (t: string) => ({ name: 'postal_code', type: t }), issues: () => undefined, value: () => '', set, touched: () => false, dirty: () => false } as any
}

test('uppercases on input, writes the uppercased value back to the field, and does NOT bubble onchange on input', async () => {
	const set = vi.fn()
	const onchange = vi.fn()
	render(InputPostalCode, { field: mockField(set), label: 'Postal code', onchange })
	const input = document.querySelector('input') as HTMLInputElement
	input.value = 'k1a 0b1'
	input.dispatchEvent(new Event('input', { bubbles: true }))
	await vi.waitFor(() => expect(input.value).toBe('K1A 0B1'))
	expect(set).toHaveBeenCalledWith('K1A 0B1')
	expect(onchange).not.toHaveBeenCalled() // uppercase is input-only; no re-fire
})

test('bubbles onchange (once) on the change event, with the value already uppercased', async () => {
	const onchange = vi.fn()
	render(InputPostalCode, { field: mockField(), onchange })
	const input = document.querySelector('input') as HTMLInputElement
	input.value = 'sw1a 1aa'
	input.dispatchEvent(new Event('input', { bubbles: true }))
	input.dispatchEvent(new Event('change', { bubbles: true }))
	await vi.waitFor(() => expect(onchange).toHaveBeenCalledTimes(1))
	expect((onchange.mock.calls[0][0].target as HTMLInputElement).value).toBe('SW1A 1AA')
})
