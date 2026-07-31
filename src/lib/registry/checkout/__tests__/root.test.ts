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

import Harness from './root-harness.svelte'

const CART_WITH_SHIPPING = {
	id: 'c',
	shipping_methods: [{ id: 'sm', shipping_option_id: 'so' }]
} as any
const makeForm = () => ({ fields: {} }) as any

beforeEach(() => {
	h.getCart.mockClear()
	h.completeCart.mockClear()
})

test('placeOrder runs address→payment→completeCart and sets order', async () => {
	h.getCart.mockReturnValue({ current: CART_WITH_SHIPPING })
	h.completeCart.mockResolvedValue({ id: 'order_9' } as any)
	await render(Harness, { form: makeForm(), navigate: vi.fn() })
	;(document.querySelector('[data-testid=reg-addr]') as HTMLButtonElement).click()
	;(document.querySelector('[data-testid=reg-pay]') as HTMLButtonElement).click()
	;(document.querySelector('[data-testid=place]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(document.querySelector('[data-testid=order]')!.textContent).toBe('order_9'))
	expect(h.completeCart).toHaveBeenCalled()
})

test('placeOrder navigates to redirectTo(order) instead of setting in-place order', async () => {
	const navigate = vi.fn()
	h.getCart.mockReturnValue({ current: CART_WITH_SHIPPING })
	h.completeCart.mockResolvedValue({ id: 'order_5' } as any)
	await render(Harness, {
		form: makeForm(),
		navigate,
		redirectTo: (o: any) => `/order/${o.id}`
	})
	;(document.querySelector('[data-testid=reg-pay]') as HTMLButtonElement).click()
	;(document.querySelector('[data-testid=place]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/order/order_5'))
	// On the redirect path `order` must stay unset — otherwise <Confirmation> would render in place
	// while the target route loads.
	expect(document.querySelector('[data-testid=order]')!.textContent).toBe('none')
})

test('placeOrder errors (no order set) when the cart has no shipping method', async () => {
	h.getCart.mockReturnValue({ current: { id: 'c', shipping_methods: [] } as any })
	await render(Harness, { form: makeForm(), navigate: vi.fn() })
	;(document.querySelector('[data-testid=place]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(document.querySelector('[data-testid=placing]')!.textContent).toBe('false'))
	expect(h.completeCart).not.toHaveBeenCalled()
	expect(document.querySelector('[data-testid=order]')!.textContent).toBe('none')
})
