import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './preset-harness.svelte'

function field(name: string) {
	let v = ''
	return {
		as: (t: string) => ({ name, type: t }),
		issues: () => undefined,
		value: () => v,
		set: (nv: string) => {
			v = nv
		},
		touched: () => false,
		dirty: () => false
	}
}
function makeForm() {
	const fields: Record<string, any> = {}
	const names = [
		'email', 'hideBilling', 'first_name', 'last_name', 'address_1', 'address_2', 'city', 'province',
		'postal_code', 'country_code', 'phone', 'billing_first_name', 'billing_last_name', 'billing_address_1',
		'billing_address_2', 'billing_city', 'billing_province', 'billing_postal_code', 'billing_country_code',
		'billing_phone'
	]
	for (const n of names) fields[n] = field(n)
	return { fields } as any
}

const CART = {
	id: 'cart_1',
	currency_code: 'usd',
	email: 'test@example.com',
	items: [
		{ id: 'item_1', product_title: 'Widget', variant_title: 'Blue', quantity: 2, unit_price: 1000, subtotal: 2000, thumbnail: null }
	],
	shipping_methods: [{ id: 'sm_1', shipping_option_id: 'so_1', name: 'Standard' }],
	shipping_address: {},
	billing_address: {},
	subtotal: 2000,
	discount_total: 0,
	shipping_total: 500,
	tax_total: 100,
	total: 2600,
	promotions: []
} as any

test('CheckoutBraintree renders the address fields, an items row, a summary total, and place-order — all in one form', async () => {
	render(Harness, {
		form: makeForm(),
		getCart: () => ({ current: CART }),
		completeCart: vi.fn(async () => ({ id: 'order_1' }) as any)
	})

	const formEl = document.querySelector('form')
	expect(formEl).not.toBeNull()

	// Address fields render (AddressForm, no apiKey → plain text address_1 input)
	expect(formEl!.querySelector('[name=email]')).not.toBeNull()
	expect(formEl!.querySelector('[name=first_name]')).not.toBeNull()
	expect(formEl!.querySelector('[name=address_1]')).not.toBeNull()

	// An items row renders
	expect(formEl!.querySelector('[data-checkout-line]')).not.toBeNull()

	// A summary total renders
	expect(formEl!.querySelector('[data-checkout-summary-total]')).not.toBeNull()

	// A place-order button renders
	expect(formEl!.querySelector('[data-checkout-place-order]')).not.toBeNull()
})
