import { expect, test, vi } from 'vitest'
import { runPlaceOrder, resolveRedirect, getBraintreeClientToken, getStripeClientSecret, resolveProvider } from '../checkout-logic'

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
		updateAddress: async () => { calls.push('addr'); return { id: 'c' } as any },
		hasShipping: () => true,
		authorizePayment: async () => { calls.push('pay'); return { ok: true } },
		completeCart: async () => { calls.push('complete'); return { id: 'order_1' } as any }
	})
	expect(calls).toEqual(['addr', 'pay', 'complete'])
	expect(res).toEqual({ order: { id: 'order_1' } })
})

test('runPlaceOrder errors when no shipping method is set (before payment)', async () => {
	const pay = vi.fn(async () => ({ ok: true }))
	const res = await runPlaceOrder({
		updateAddress: async () => ({ id: 'c' } as any),
		hasShipping: () => false,
		authorizePayment: pay,
		completeCart: async () => ({ id: 'o' } as any)
	})
	expect(res).toHaveProperty('error')
	expect(pay).not.toHaveBeenCalled()
})

test('runPlaceOrder surfaces a failed authorize and skips completeCart', async () => {
	const complete = vi.fn(async () => ({ id: 'o' } as any))
	const res = await runPlaceOrder({
		updateAddress: async () => ({ id: 'c' } as any),
		hasShipping: () => true,
		authorizePayment: async () => ({ ok: false, error: 'declined' }),
		completeCart: complete
	})
	expect(res).toEqual({ error: 'declined' })
	expect(complete).not.toHaveBeenCalled()
})

test('runPlaceOrder returns error when completeCart yields a cart-with-errors (not an order)', async () => {
	const res = await runPlaceOrder({
		updateAddress: async () => ({ id: 'c' } as any),
		hasShipping: () => true,
		authorizePayment: async () => ({ ok: true }),
		completeCart: async () => ({ id: 'cart', object: 'cart' } as any)  // not an order
	})
	expect(res).toHaveProperty('error')
})

test('resolveRedirect handles string and function forms', () => {
	expect(resolveRedirect('/thanks', { id: 'o' } as any)).toBe('/thanks')
	expect(resolveRedirect((o) => `/order/${o.id}`, { id: 'o1' } as any)).toBe('/order/o1')
	expect(resolveRedirect(undefined, { id: 'o' } as any)).toBe(undefined)
})

test('getBraintreeClientToken digs the client_token out of the session', () => {
	const session = { payment_collection: { payment_sessions: [{ provider_id: 'pp_braintree_braintree', data: { client_token: 'tok_123' } }] } }
	expect(getBraintreeClientToken(session, 'pp_braintree_braintree')).toBe('tok_123')
	expect(getBraintreeClientToken(null, 'pp_braintree_braintree')).toBe(undefined)
	expect(getBraintreeClientToken({ payment_collection: { payment_sessions: [] } }, 'pp_braintree_braintree')).toBe(undefined)
})

test('getStripeClientSecret digs the client_secret out of the session (PaymentIntent data)', () => {
	const session = { payment_collection: { payment_sessions: [{ provider_id: 'pp_stripe_stripe', data: { id: 'pi_1', client_secret: 'pi_1_secret_abc' } }] } }
	expect(getStripeClientSecret(session, 'pp_stripe_stripe')).toBe('pi_1_secret_abc')
	expect(getStripeClientSecret(null, 'pp_stripe_stripe')).toBe(undefined)
	expect(getStripeClientSecret({ payment_collection: { payment_sessions: [] } }, 'pp_stripe_stripe')).toBe(undefined)
})
