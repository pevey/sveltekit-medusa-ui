import { render } from 'vitest-browser-svelte'
import { expect, test, vi } from 'vitest'
import Harness from './discount-harness.svelte'

test('typing a code and clicking Redeem calls injected addPromotion with lowercased code', async () => {
	const addPromotion = vi.fn().mockResolvedValue({ id: 'c', promotions: [] } as any)
	const removePromotion = vi.fn()

	render(Harness, {
		getCart: () => ({ current: { id: 'c', promotions: [] } as any }),
		addPromotion,
		removePromotion
	})

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
		expect(addPromotion).toHaveBeenCalledWith('save10')
	})
})

test('with a cart containing promotions, a chip renders per promotion and clicking remove calls removePromotion', async () => {
	const addPromotion = vi.fn()
	const removePromotion = vi.fn().mockResolvedValue({ id: 'c', promotions: [] } as any)

	render(Harness, {
		getCart: () => ({ current: { id: 'c', promotions: [{ id: 'p1', code: 'save10' }] } as any }),
		addPromotion,
		removePromotion
	})

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
		expect(removePromotion).toHaveBeenCalledWith('save10')
	})
})
