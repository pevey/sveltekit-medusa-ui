import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './submit-harness.svelte'

const CART_WITH_SHIPPING = { id: 'c', shipping_methods: [{ id: 'sm', shipping_option_id: 'so' }] } as any
const CART_WITHOUT_SHIPPING = { id: 'c', shipping_methods: [] } as any
const makeForm = () => ({ fields: {} }) as any

test('PlaceOrder button reflects ctx.placing and clicking it calls the flow', async () => {
	const completeCart = vi.fn(async () => ({ id: 'order_1' }) as any)
	render(Harness, { form: makeForm(), getCart: () => ({ current: CART_WITH_SHIPPING }), completeCart })

	const button = document.querySelector('[data-checkout-place-order]') as HTMLButtonElement
	expect(button.disabled).toBe(false)

	button.click()
	await vi.waitFor(() => expect(completeCart).toHaveBeenCalled())
	await vi.waitFor(() => expect(button.disabled).toBe(false))
})

test('Confirmation renders nothing until an order is placed, then shows the order id', async () => {
	const completeCart = vi.fn(
		async () =>
			({
				id: 'order_1',
				display_id: 5,
				email: 'a@b.com',
				items: [],
				total: 10,
				currency_code: 'usd'
			}) as any
	)
	render(Harness, { form: makeForm(), getCart: () => ({ current: CART_WITH_SHIPPING }), completeCart })

	expect(document.querySelector('[data-checkout-confirmation]')).toBeNull()

	const button = document.querySelector('[data-checkout-place-order]') as HTMLButtonElement
	button.click()

	await vi.waitFor(() => expect(document.querySelector('[data-checkout-confirmation]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-confirmation]')!.textContent).toContain('Order #5')
})

test('Error banner shows the failure message when the cart has no shipping method', async () => {
	const completeCart = vi.fn()
	render(Harness, { form: makeForm(), getCart: () => ({ current: CART_WITHOUT_SHIPPING }), completeCart })

	expect(document.querySelector('[data-checkout-error]')).toBeNull()

	const button = document.querySelector('[data-checkout-place-order]') as HTMLButtonElement
	button.click()

	await vi.waitFor(() => expect(document.querySelector('[data-checkout-error]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-error]')!.textContent).toContain('No delivery method selected')
	expect(completeCart).not.toHaveBeenCalled()
})
