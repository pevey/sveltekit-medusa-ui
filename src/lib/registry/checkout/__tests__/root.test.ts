import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './root-harness.svelte'

const CART_WITH_SHIPPING = { id: 'c', shipping_methods: [{ id: 'sm', shipping_option_id: 'so' }] } as any
const makeForm = () => ({ fields: {} }) as any

test('placeOrder runs address→payment→completeCart and sets order', async () => {
	const completeCart = vi.fn(async () => ({ id: 'order_9' }) as any)
	render(Harness, { form: makeForm(), getCart: () => ({ current: CART_WITH_SHIPPING }), completeCart, navigate: vi.fn() })
	;(document.querySelector('[data-testid=reg-addr]') as HTMLButtonElement).click()
	;(document.querySelector('[data-testid=reg-pay]') as HTMLButtonElement).click()
	;(document.querySelector('[data-testid=place]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(document.querySelector('[data-testid=order]')!.textContent).toBe('order_9'))
	expect(completeCart).toHaveBeenCalled()
})

test('placeOrder navigates to redirectTo(order) instead of setting in-place order', async () => {
	const navigate = vi.fn()
	render(Harness, {
		form: makeForm(), getCart: () => ({ current: CART_WITH_SHIPPING }),
		completeCart: async () => ({ id: 'order_5' }) as any, navigate, redirectTo: (o: any) => `/order/${o.id}`
	})
	;(document.querySelector('[data-testid=reg-pay]') as HTMLButtonElement).click()
	;(document.querySelector('[data-testid=place]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/order/order_5'))
	// On the redirect path `order` must stay unset — otherwise <Confirmation> would render in place
	// while the target route loads.
	expect(document.querySelector('[data-testid=order]')!.textContent).toBe('none')
})

test('placeOrder errors (no order set) when the cart has no shipping method', async () => {
	const completeCart = vi.fn()
	render(Harness, { form: makeForm(), getCart: () => ({ current: { id: 'c', shipping_methods: [] } as any }), completeCart, navigate: vi.fn() })
	;(document.querySelector('[data-testid=place]') as HTMLButtonElement).click()
	await vi.waitFor(() => expect(document.querySelector('[data-testid=placing]')!.textContent).toBe('false'))
	expect(completeCart).not.toHaveBeenCalled()
	expect(document.querySelector('[data-testid=order]')!.textContent).toBe('none')
})
