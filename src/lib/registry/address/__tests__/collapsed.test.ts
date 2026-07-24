import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './collapsed-harness.svelte'

function field(name: string) {
	let v = ''
	return { as: (t: string) => ({ name, type: t }), issues: () => undefined, value: () => v, set: (nv: string) => { v = nv }, touched: () => false, dirty: () => false }
}
function makeForm() {
	const fields: Record<string, any> = {}
	for (const n of ['email', 'hideBilling', 'first_name', 'last_name', 'address_1', 'address_2', 'city', 'province', 'postal_code', 'country_code', 'phone']) fields[n] = field(n)
	return { fields } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]
const common = { getCart: () => ({ current: null }), getRegions: () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }), updateCart: vi.fn() }

test('collapsed: anchors visible, structured block present but clipped (sr-only, not display:none)', async () => {
	render(Harness, { form: makeForm(), ...common })
	// anchors present
	expect(document.querySelector('[name=email]')).not.toBeNull()
	// structured field present in DOM (autofillable) ...
	const city = document.querySelector('[name=city]') as HTMLElement
	expect(city).not.toBeNull()
	// ... inside a clipped container (has sr-only), NOT display:none
	const clipped = document.querySelector('.sr-only, [data-collapsed-fields]')
	expect(clipped).not.toBeNull()
	expect(getComputedStyle(clipped as Element).display).not.toBe('none')
})

test('a change on a structured field reveals the block (removes clip)', async () => {
	render(Harness, { form: makeForm(), ...common })
	const container = document.querySelector('[data-collapsed-fields]') as HTMLElement
	expect(container.classList.contains('sr-only')).toBe(true)
	const city = document.querySelector('[name=city]') as HTMLInputElement
	city.value = 'Shreveport'
	city.dispatchEvent(new Event('input', { bubbles: true }))
	await vi.waitFor(() => expect(container.classList.contains('sr-only')).toBe(false))
})

test('`input` reveals the block but does NOT save; `change` saves (save-on-blur cadence preserved)', async () => {
	const updateCart = vi.fn(async () => ({ id: 'cart_1' }) as any)
	render(Harness, { form: makeForm(), ...common, updateCart })
	const container = document.querySelector('[data-collapsed-fields]') as HTMLElement
	const city = document.querySelector('[name=city]') as HTMLInputElement

	// `input` alone: reveals (reconciled via ondelegatedinput's reveal-only path) but never saves.
	city.value = 'Shreveport'
	city.dispatchEvent(new Event('input', { bubbles: true }))
	await vi.waitFor(() => expect(container.classList.contains('sr-only')).toBe(false))
	// Give a debounce-length window a chance to elapse; updateCart must still not have fired.
	await new Promise((r) => setTimeout(r, 250))
	expect(updateCart).not.toHaveBeenCalled()

	// `change` on the same field: saving stays on `change` (onchange → reconcileAndSave).
	city.dispatchEvent(new Event('change', { bubbles: true }))
	await vi.waitFor(() => expect(updateCart).toHaveBeenCalled())
})
