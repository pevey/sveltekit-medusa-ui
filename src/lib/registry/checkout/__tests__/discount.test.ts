import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

// The component imports getCart/addPromotion/removePromotion from the SDK barrel. Mock just those
// three in the test file (spreading the rest of the module) — the component stays injection-free.
const h = vi.hoisted(() => ({
	getCart: vi.fn(() => ({ current: null }) as any),
	addPromotion: vi.fn(async () => null as any),
	removePromotion: vi.fn(async () => null as any)
}))
vi.mock('sveltekit-medusa-sdk', async orig => ({
	...(await orig<Record<string, unknown>>()),
	getCart: h.getCart,
	addPromotion: h.addPromotion,
	removePromotion: h.removePromotion
}))

import Harness from './discount-harness.svelte'

beforeEach(() => {
	h.getCart.mockReset()
	h.addPromotion.mockReset()
	h.removePromotion.mockReset()
})

test('typing a code and clicking Redeem calls injected addPromotion with lowercased code', async () => {
	h.getCart.mockReturnValue({ current: { id: 'c', promotions: [] } as any })
	h.addPromotion.mockResolvedValue({ id: 'c', promotions: [] } as any)

	render(Harness, {})

	const input = document.querySelector('input[type="text"]') as HTMLInputElement
	const button = document.querySelector('button[type="button"]') as HTMLButtonElement

	expect(input).toBeDefined()
	expect(button).toBeDefined()

	// Type in the code
	input.value = 'SAVE10'
	input.dispatchEvent(new Event('change'))
	input.dispatchEvent(new Event('input'))

	// Click Redeem button
	button.click()

	// Wait for async handler
	await vi.waitFor(() => {
		expect(h.addPromotion).toHaveBeenCalledWith('save10')
	})
})

test('with a cart containing promotions, a chip renders per promotion and clicking remove calls removePromotion', async () => {
	h.getCart.mockReturnValue({
		current: { id: 'c', promotions: [{ id: 'p1', code: 'save10' }] } as any
	})
	h.removePromotion.mockResolvedValue({ id: 'c', promotions: [] } as any)

	render(Harness, {})

	// Check that the chip is rendered
	await vi.waitFor(() => {
		expect(document.body.textContent).toContain('save10')
	})

	// Find and click the remove button (×)
	const removeButton = document.querySelector('button[aria-label="Remove save10"]') as HTMLButtonElement
	expect(removeButton).toBeDefined()

	removeButton.click()

	// Wait for async handler
	await vi.waitFor(() => {
		expect(h.removePromotion).toHaveBeenCalledWith('save10')
	})
})
