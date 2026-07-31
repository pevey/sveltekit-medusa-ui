import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

// Checkout.Root (rendered by the harness) imports getCart from the SDK barrel. Mock just that in the
// test file (spreading the rest of the module) — the component stays injection-free.
const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart
}))

import Harness from './auto-harness.svelte'

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
		'email',
		'hideBilling',
		'first_name',
		'last_name',
		'address_1',
		'address_2',
		'city',
		'province',
		'postal_code',
		'country_code',
		'phone',
		'billing_first_name',
		'billing_last_name',
		'billing_address_1',
		'billing_address_2',
		'billing_city',
		'billing_province',
		'billing_postal_code',
		'billing_country_code',
		'billing_phone'
	]
	for (const n of names) fields[n] = field(n)
	return { fields } as any
}

const cartWith = (providerIds: string[]) =>
	({
		id: 'cart_1',
		currency_code: 'usd',
		region: { id: 'reg_1', payment_providers: providerIds.map(id => ({ id })) },
		items: [
			{
				id: 'item_1',
				product_title: 'Widget',
				quantity: 1,
				unit_price: 1000,
				subtotal: 1000,
				thumbnail: null
			}
		],
		shipping_methods: [],
		shipping_address: {},
		billing_address: {},
		subtotal: 1000,
		discount_total: 0,
		shipping_total: 0,
		tax_total: 0,
		total: 1000,
		promotions: []
	}) as any

beforeEach(() => {
	h.getCart.mockReset()
})

test('renders the Braintree body when the region uses Braintree', async () => {
	h.getCart.mockReturnValue({ current: cartWith(['pp_braintree_braintree']) })
	await render(Harness, { form: makeForm() })
	await vi.waitFor(() => expect(document.querySelector('[data-checkout-braintree-payment]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-stripe-loading]')).toBeNull()
})

test('renders the Stripe (Elements) body when the region uses Stripe', async () => {
	h.getCart.mockReturnValue({ current: cartWith(['pp_stripe_stripe']) })
	await render(Harness, { form: makeForm() })
	// Elements now mounts in deferred mode (no payment session required), so assert the Stripe
	// boundary itself rather than the loading state it used to be stuck in.
	await vi.waitFor(() => expect(document.querySelector('[data-checkout-stripe-elements]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-braintree-payment]')).toBeNull()
})

test('routes the whole Stripe family (e.g. iDEAL) to the Stripe body', async () => {
	h.getCart.mockReturnValue({ current: cartWith(['pp_stripe-ideal_stripe']) })
	await render(Harness, { form: makeForm() })
	await vi.waitFor(() => expect(document.querySelector('[data-checkout-stripe-elements]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-braintree-payment]')).toBeNull()
})

test('renders nothing + dev-errors for an unsupported provider id', async () => {
	const err = vi.spyOn(console, 'error').mockImplementation(() => {})
	h.getCart.mockReturnValue({ current: cartWith(['pp_paypal_paypal']) })
	await render(Harness, { form: makeForm() })
	await vi.waitFor(() => expect(err).toHaveBeenCalledWith(expect.stringContaining('pp_paypal_paypal')))
	expect(document.querySelector('[data-checkout-braintree-payment]')).toBeNull()
	expect(document.querySelector('[data-checkout-stripe-loading]')).toBeNull()
	err.mockRestore()
})
