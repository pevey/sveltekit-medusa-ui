import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi } from 'vitest'

const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	updateCartItem: vi.fn(async () => null as any),
	removeFromCart: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	updateCartItem: h.updateCartItem,
	removeFromCart: h.removeFromCart
}))

import Harness from './drawer-harness.svelte'

const cart = { current: { id: 'c', items: [{ id: 'a', product_title: 'Tee', quantity: 2, unit_price: 1000 }] } } as any

test('trigger renders with the badge count before the sheet opens', async () => {
	h.getCart.mockReturnValue(cart)
	const { container } = await render(Harness, {})
	await expect.element(vpage.getByText('2')).toBeInTheDocument()
	expect(container.querySelector('[data-cart-trigger]')).not.toBeNull()
	// Content is portalled and only mounts once opened.
	expect(document.querySelector('[data-cart-content]')).toBeNull()
})

test('trigger is a bare icon, not a shadcn button', async () => {
	h.getCart.mockReturnValue(cart)
	const { container } = await render(Harness, {})
	const trigger = container.querySelector('[data-cart-trigger]')!
	// No button box: the glyph carries the size, and the trigger contributes no background or
	// padding of its own so a navbar controls the spacing.
	expect(trigger.className).not.toContain('bg-')
	expect(trigger.className).not.toMatch(/\bsize-\d/)
	expect(trigger.querySelector('svg')?.getAttribute('class') ?? '').toContain('size-8')
})

test('opening the drawer reveals the header and the lines', async () => {
	h.getCart.mockReturnValue(cart)
	const { container } = await render(Harness, {})
	await (container.querySelector('[data-cart-trigger]') as HTMLElement).click()
	await expect.element(vpage.getByRole('dialog')).toBeInTheDocument()
	// Header always emits a title plus an sr-only description, so the dialog stays labelled.
	const content = document.querySelector('[data-cart-content]')!
	expect(content.querySelector('[data-slot="sheet-title"]')?.textContent?.trim()).toBe('Cart')
	expect(content.querySelector('[data-slot="sheet-description"]')).not.toBeNull()
	expect(content.querySelectorAll('[data-cart-item]').length).toBe(1)
})

test('following a link inside the drawer closes it', async () => {
	h.getCart.mockReturnValue(cart)
	const { container } = await render(Harness, {})
	await (container.querySelector('[data-cart-trigger]') as HTMLElement).click()
	await expect.element(vpage.getByRole('dialog')).toBeInTheDocument()

	await (document.querySelector('[data-cart-checkout]') as HTMLElement).click()
	await vi.waitFor(() => expect(document.querySelector('[data-cart-content]')).toBeNull())
})

test('a link closes the drawer from the line parts too', async () => {
	h.getCart.mockReturnValue(cart)
	const { container } = await render(Harness, {})
	await (container.querySelector('[data-cart-trigger]') as HTMLElement).click()
	await expect.element(vpage.getByRole('dialog')).toBeInTheDocument()

	await (document.querySelector('[data-cart-title]') as HTMLElement).click()
	await vi.waitFor(() => expect(document.querySelector('[data-cart-content]')).toBeNull())
})
