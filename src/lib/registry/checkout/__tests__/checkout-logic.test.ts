import { expect, test, vi } from 'vitest'
import {
	runPlaceOrder,
	resolveRedirect,
	getBraintreeClientToken,
	getStripeClientSecret,
	resolveProvider,
	classifyProvider,
	resolveCheckoutProvider,
	resolveStripeMethod,
	cartBillingDetails,
	medusaShippingToStripeRates,
	walletAddressToMedusa
} from '../checkout-logic'

test('resolveStripeMethod maps wired provider ids, else null', () => {
	expect(resolveStripeMethod('pp_stripe_stripe')).toBe('card')
	expect(resolveStripeMethod('pp_stripe-ideal_stripe')).toBe('ideal')
	expect(resolveStripeMethod('pp_stripe-bancontact_stripe')).toBeNull()
})

test('cartBillingDetails builds billing_details from the cart shipping address', () => {
	const cart = {
		email: 'a@b.co',
		shipping_address: {
			first_name: 'Ada',
			last_name: 'L',
			phone: '123',
			address_1: '1 St',
			city: 'X',
			postal_code: '11',
			province: 'CA',
			country_code: 'us'
		}
	}
	expect(cartBillingDetails(cart)).toEqual({
		name: 'Ada L',
		email: 'a@b.co',
		phone: '123',
		address: {
			line1: '1 St',
			line2: undefined,
			city: 'X',
			postal_code: '11',
			state: 'CA',
			country: 'us'
		}
	})
})

test('cartBillingDetails tolerates a null cart', () => {
	expect(cartBillingDetails(null)).toEqual({})
})

test('medusaShippingToStripeRates maps Medusa options to Stripe shipping rates', () => {
	expect(medusaShippingToStripeRates([{ id: 'so_1', name: 'Standard', amount: 500 }])).toEqual([{ id: 'so_1', displayName: 'Standard', amount: 500 }])
	expect(medusaShippingToStripeRates([])).toEqual([])
})

test('walletAddressToMedusa splits name + maps address (lowercased country)', () => {
	const billing = {
		name: 'Ada L',
		email: 'a@b.co',
		phone: '1',
		address: {
			line1: '1 St',
			line2: 'Apt 2',
			city: 'X',
			state: 'CA',
			postal_code: '11',
			country: 'US'
		}
	}
	expect(walletAddressToMedusa(billing)).toMatchObject({
		email: 'a@b.co',
		shipping_address: {
			first_name: 'Ada',
			last_name: 'L',
			phone: '1',
			address_1: '1 St',
			address_2: 'Apt 2',
			city: 'X',
			province: 'CA',
			postal_code: '11',
			country_code: 'us'
		}
	})
})

test('classifyProvider routes the whole Stripe family to stripe, braintree to braintree, else null', () => {
	expect(classifyProvider('pp_stripe_stripe')).toBe('stripe')
	expect(classifyProvider('pp_stripe-ideal_stripe')).toBe('stripe')
	expect(classifyProvider('pp_stripe-bancontact_stripe')).toBe('stripe')
	expect(classifyProvider('pp_braintree_braintree')).toBe('braintree')
	expect(classifyProvider('pp_paypal_paypal')).toBeNull()
})

test('resolveCheckoutProvider returns the first renderable provider + its kind', () => {
	expect(resolveCheckoutProvider(['pp_paypal_paypal', 'pp_stripe-ideal_stripe'])).toEqual({
		id: 'pp_stripe-ideal_stripe',
		kind: 'stripe'
	})
	expect(resolveCheckoutProvider(['pp_braintree_braintree'])).toEqual({
		id: 'pp_braintree_braintree',
		kind: 'braintree'
	})
	expect(resolveCheckoutProvider(['pp_paypal_paypal'])).toBeNull()
	expect(resolveCheckoutProvider([])).toBeNull()
})

const SUPPORTED = ['pp_braintree_braintree', 'pp_stripe_stripe']

test('resolveProvider returns the first supported provider (skipping unsupported ids)', () => {
	expect(resolveProvider(['pp_stripe_stripe'], SUPPORTED)).toBe('pp_stripe_stripe')
	expect(resolveProvider(['pp_paypal_paypal', 'pp_braintree_braintree'], SUPPORTED)).toBe('pp_braintree_braintree')
	expect(resolveProvider(['pp_paypal_paypal'], SUPPORTED)).toBeUndefined()
	expect(resolveProvider([], SUPPORTED)).toBeUndefined()
})

test('runPlaceOrder runs steps in order and returns the order', async () => {
	const calls: string[] = []
	const res = await runPlaceOrder({
		updateAddress: async () => {
			calls.push('addr')
			return { id: 'c' } as any
		},
		hasShipping: () => true,
		authorizePayment: async () => {
			calls.push('pay')
			return { ok: true }
		},
		completeCart: async () => {
			calls.push('complete')
			return { id: 'order_1' } as any
		}
	})
	expect(calls).toEqual(['addr', 'pay', 'complete'])
	expect(res).toEqual({ order: { id: 'order_1' } })
})

test('runPlaceOrder errors when no shipping method is set (before payment)', async () => {
	const pay = vi.fn(async () => ({ ok: true }))
	const res = await runPlaceOrder({
		updateAddress: async () => ({ id: 'c' }) as any,
		hasShipping: () => false,
		authorizePayment: pay,
		completeCart: async () => ({ id: 'o' }) as any
	})
	expect(res).toHaveProperty('error')
	expect(pay).not.toHaveBeenCalled()
})

test('runPlaceOrder surfaces a failed authorize and skips completeCart', async () => {
	const complete = vi.fn(async () => ({ id: 'o' }) as any)
	const res = await runPlaceOrder({
		updateAddress: async () => ({ id: 'c' }) as any,
		hasShipping: () => true,
		authorizePayment: async () => ({ ok: false, error: 'declined' }),
		completeCart: complete
	})
	expect(res).toEqual({ error: 'declined' })
	expect(complete).not.toHaveBeenCalled()
})

test('runPlaceOrder returns error when completeCart yields a cart-with-errors (not an order)', async () => {
	const res = await runPlaceOrder({
		updateAddress: async () => ({ id: 'c' }) as any,
		hasShipping: () => true,
		authorizePayment: async () => ({ ok: true }),
		completeCart: async () => ({ id: 'cart', object: 'cart' }) as any // not an order
	})
	expect(res).toHaveProperty('error')
})

test('resolveRedirect handles string and function forms', () => {
	expect(resolveRedirect('/thanks', { id: 'o' } as any)).toBe('/thanks')
	expect(resolveRedirect(o => `/order/${o.id}`, { id: 'o1' } as any)).toBe('/order/o1')
	expect(resolveRedirect(undefined, { id: 'o' } as any)).toBe(undefined)
})

test('getBraintreeClientToken digs the client_token out of the session', () => {
	const session = {
		payment_collection: {
			payment_sessions: [{ provider_id: 'pp_braintree_braintree', data: { client_token: 'tok_123' } }]
		}
	}
	expect(getBraintreeClientToken(session, 'pp_braintree_braintree')).toBe('tok_123')
	expect(getBraintreeClientToken(null, 'pp_braintree_braintree')).toBe(undefined)
	expect(getBraintreeClientToken({ payment_collection: { payment_sessions: [] } }, 'pp_braintree_braintree')).toBe(undefined)
})

test('getStripeClientSecret digs the client_secret out of the session (PaymentIntent data)', () => {
	const session = {
		payment_collection: {
			payment_sessions: [
				{
					provider_id: 'pp_stripe_stripe',
					data: { id: 'pi_1', client_secret: 'pi_1_secret_abc' }
				}
			]
		}
	}
	expect(getStripeClientSecret(session, 'pp_stripe_stripe')).toBe('pi_1_secret_abc')
	expect(getStripeClientSecret(null, 'pp_stripe_stripe')).toBe(undefined)
	expect(getStripeClientSecret({ payment_collection: { payment_sessions: [] } }, 'pp_stripe_stripe')).toBe(undefined)
})
