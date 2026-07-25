import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './auto-harness.svelte'

function field(name: string) {
	let v = ''
	return { as: (t: string) => ({ name, type: t }), issues: () => undefined, value: () => v, set: (nv: string) => { v = nv }, touched: () => false, dirty: () => false }
}
function makeForm() {
	const fields: Record<string, any> = {}
	const names = [
		'email', 'hideBilling', 'first_name', 'last_name', 'address_1', 'address_2', 'city', 'province',
		'postal_code', 'country_code', 'phone', 'billing_first_name', 'billing_last_name', 'billing_address_1',
		'billing_address_2', 'billing_city', 'billing_province', 'billing_postal_code', 'billing_country_code', 'billing_phone'
	]
	for (const n of names) fields[n] = field(n)
	return { fields } as any
}

const cartWith = (providerIds: string[]) => ({
	id: 'cart_1',
	currency_code: 'usd',
	region: { id: 'reg_1', payment_providers: providerIds.map((id) => ({ id })) },
	items: [{ id: 'item_1', product_title: 'Widget', quantity: 1, unit_price: 1000, subtotal: 1000, thumbnail: null }],
	shipping_methods: [],
	shipping_address: {},
	billing_address: {},
	subtotal: 1000, discount_total: 0, shipping_total: 0, tax_total: 0, total: 1000, promotions: []
}) as any

test('renders the Braintree body when the region uses Braintree', async () => {
	render(Harness, { form: makeForm(), getCart: () => ({ current: cartWith(['pp_braintree_braintree']) }) })
	await vi.waitFor(() => expect(document.querySelector('[data-checkout-braintree-payment]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-stripe-loading]')).toBeNull()
})

test('renders the Stripe (Elements) body when the region uses Stripe', async () => {
	render(Harness, { form: makeForm(), getCart: () => ({ current: cartWith(['pp_stripe_stripe']) }) })
	// The stub's initiatePaymentSession returns null → the Elements boundary shows its loading state,
	// which is enough to prove the Stripe path was chosen (no live gateway in tests).
	await vi.waitFor(() => expect(document.querySelector('[data-checkout-stripe-loading]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-braintree-payment]')).toBeNull()
})

test('routes the whole Stripe family (e.g. iDEAL) to the Stripe body', async () => {
	render(Harness, { form: makeForm(), getCart: () => ({ current: cartWith(['pp_stripe-ideal_stripe']) }) })
	await vi.waitFor(() => expect(document.querySelector('[data-checkout-stripe-loading]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-braintree-payment]')).toBeNull()
})

test('renders nothing + dev-errors for an unsupported provider id', async () => {
	const err = vi.spyOn(console, 'error').mockImplementation(() => {})
	render(Harness, { form: makeForm(), getCart: () => ({ current: cartWith(['pp_paypal_paypal']) }) })
	await vi.waitFor(() =>
		expect(err).toHaveBeenCalledWith(expect.stringContaining('pp_paypal_paypal'))
	)
	expect(document.querySelector('[data-checkout-braintree-payment]')).toBeNull()
	expect(document.querySelector('[data-checkout-stripe-loading]')).toBeNull()
	err.mockRestore()
})
