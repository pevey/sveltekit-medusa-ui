import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './commit-harness.svelte'

function field(initial = '') {
	let v = initial
	return { as: (t: string) => ({ name: '', type: t }), issues: () => undefined, value: () => v, set: (nv: string) => { v = nv }, touched: () => false, dirty: () => false }
}
function makeForm(values: Record<string, string> = {}) {
	const fields: Record<string, any> = {}
	const names = ['email', 'hideBilling', 'first_name', 'last_name', 'address_1', 'address_2', 'city', 'province', 'postal_code', 'country_code', 'phone',
		'billing_first_name', 'billing_last_name', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_province', 'billing_postal_code', 'billing_country_code', 'billing_phone', 'company', 'billing_company']
	for (const n of names) { const f = field(values[n] ?? ''); f.as = (t: string) => ({ name: n, type: t }); fields[n] = f }
	return { fields } as any
}
const REGIONS = [{ id: 'reg_us', countries: [{ iso_2: 'us', display_name: 'United States' }] }]
const regionsRes = () => Object.assign(Promise.resolve(REGIONS), { current: REGIONS }) as any
const common = { getCart: () => ({ current: null }), getRegions: regionsRes }

test('setExpanded flips the expanded context value', async () => {
	render(Harness, { form: makeForm(), ...common, updateCart: vi.fn() })
	expect(document.querySelector('[data-testid=expanded]')!.textContent).toBe('false')
	;(document.querySelector('[data-testid=expand]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(document.querySelector('[data-testid=expanded]')!.textContent).toBe('true'))
})

test('commit reconciles from the DOM, normalizes country/province to codes, and awaits updateCart', async () => {
	const updateCart = vi.fn(async (_args: any) => ({ id: 'cart_1' }) as any)
	render(Harness, { form: makeForm({ country_code: '', province: '', city: '' }), ...common, updateCart })
	;(document.querySelector('[data-testid=commit]') as HTMLButtonElement).click()
	// commit() now also fires an earlier region-switch updateCart (Fix 1) before the final full-payload
	// call, so wait for the specific final call (marked by a `province` key only the full payload has)
	// rather than "called at all", which would resolve on the earlier call and race the assertions below.
	await vi.waitFor(() => expect(updateCart.mock.calls.some((c) => c[0]?.shipping_address?.province)).toBe(true))
	const arg = updateCart.mock.calls.at(-1)![0]
	expect(arg.shipping_address.country_code).toBe('us')      // "United States" → us
	expect(arg.shipping_address.province).toBe('us-la')       // "Louisiana" → us-la
	expect(arg.shipping_address.city).toBe('Shreveport')
})

test('commit reconciles the region before the final save (autofill-only country change)', async () => {
	const updateCart = vi.fn(async (_args: any) => ({ id: 'cart_1' }) as any)
	render(Harness, { form: makeForm({ country_code: '', province: '', city: '' }), ...common, updateCart })
	;(document.querySelector('[data-testid=commit]') as HTMLButtonElement).click()
	// Wait for the final full-payload call specifically (see comment above) rather than "called at all".
	await vi.waitFor(() => expect(updateCart.mock.calls.some((c) => c[0]?.shipping_address?.province)).toBe(true))
	// An earlier call switches the region for the (autofilled, DOM-reconciled) country.
	expect(updateCart.mock.calls.some((c) => c[0]?.region_id === 'reg_us')).toBe(true)
	// The final call still carries the full, normalized shipping_address payload.
	const arg = updateCart.mock.calls.at(-1)![0]
	expect(arg.shipping_address.country_code).toBe('us')
	expect(arg.shipping_address.province).toBe('us-la')
})

test('registerCommit is invoked on mount with a working commit fn', async () => {
	const updateCart = vi.fn(async () => ({ id: 'c' }) as any)
	let captured: (() => Promise<any>) | undefined
	render(Harness, { form: makeForm(), ...common, updateCart, registerCommit: (fn: any) => (captured = fn) })
	await vi.waitFor(() => expect(captured).toBeTypeOf('function'))
	await captured!()
	expect(updateCart).toHaveBeenCalled()
})
