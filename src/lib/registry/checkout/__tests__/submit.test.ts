import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

// The component imports getCart/completeCart from the SDK barrel. Mock just those two in the test
// file (spreading the rest of the module) — the component stays injection-free.
const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	completeCart: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	completeCart: h.completeCart
}))

import Harness from './submit-harness.svelte'

const CART_WITH_SHIPPING = {
	id: 'c',
	shipping_methods: [{ id: 'sm', shipping_option_id: 'so' }]
} as any
const CART_WITHOUT_SHIPPING = { id: 'c', shipping_methods: [] } as any
const makeForm = () => ({ fields: {} }) as any

beforeEach(() => {
	h.getCart.mockReset()
	h.completeCart.mockReset()
})

test('PlaceOrder button reflects ctx.placing and clicking it calls the flow', async () => {
	h.getCart.mockReturnValue({ current: CART_WITH_SHIPPING })
	h.completeCart.mockResolvedValue({ id: 'order_1' } as any)
	await render(Harness, { form: makeForm() })

	const button = document.querySelector('[data-checkout-place-order]') as HTMLButtonElement
	expect(button.disabled).toBe(false)

	button.click()
	await vi.waitFor(() => expect(h.completeCart).toHaveBeenCalled())
	await vi.waitFor(() => expect(button.disabled).toBe(false))
})

test('Confirmation renders nothing until an order is placed, then shows the order id', async () => {
	h.getCart.mockReturnValue({ current: CART_WITH_SHIPPING })
	h.completeCart.mockResolvedValue({
		id: 'order_1',
		display_id: 5,
		email: 'a@b.com',
		items: [],
		total: 10,
		currency_code: 'usd'
	} as any)
	await render(Harness, { form: makeForm() })

	expect(document.querySelector('[data-checkout-confirmation]')).toBeNull()

	const button = document.querySelector('[data-checkout-place-order]') as HTMLButtonElement
	button.click()

	await vi.waitFor(() => expect(document.querySelector('[data-checkout-confirmation]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-confirmation]')!.textContent).toContain('Order #5')
})

test('Error banner shows the failure message when the cart has no shipping method', async () => {
	h.getCart.mockReturnValue({ current: CART_WITHOUT_SHIPPING })
	await render(Harness, { form: makeForm() })

	expect(document.querySelector('[data-checkout-error]')).toBeNull()

	const button = document.querySelector('[data-checkout-place-order]') as HTMLButtonElement
	button.click()

	await vi.waitFor(() => expect(document.querySelector('[data-checkout-error]')).not.toBeNull())
	expect(document.querySelector('[data-checkout-error]')!.textContent).toContain('No delivery method selected')
	expect(h.completeCart).not.toHaveBeenCalled()
})
