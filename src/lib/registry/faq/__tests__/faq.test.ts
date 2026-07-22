import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import Harness from './faq-harness.svelte'

test('questions render as collapsed buttons (aria-expanded=false)', async () => {
	render(Harness)
	await expect
		.element(page.getByRole('button', { name: /Question One/ }))
		.toHaveAttribute('aria-expanded', 'false')
})

test('clicking a question expands it', async () => {
	render(Harness)
	const q1 = page.getByRole('button', { name: /Question One/ })
	await q1.click()
	await expect.element(q1).toHaveAttribute('aria-expanded', 'true')
})

test('type="single" closes the previously open question', async () => {
	render(Harness, { type: 'single' })
	await page.getByRole('button', { name: /Question One/ }).click()
	await page.getByRole('button', { name: /Question Two/ }).click()
	await expect
		.element(page.getByRole('button', { name: /Question One/ }))
		.toHaveAttribute('aria-expanded', 'false')
})

test('type="multiple" keeps multiple questions open', async () => {
	render(Harness, { type: 'multiple' })
	await page.getByRole('button', { name: /Question One/ }).click()
	await page.getByRole('button', { name: /Question Two/ }).click()
	await expect
		.element(page.getByRole('button', { name: /Question One/ }))
		.toHaveAttribute('aria-expanded', 'true')
	await expect
		.element(page.getByRole('button', { name: /Question Two/ }))
		.toHaveAttribute('aria-expanded', 'true')
})

test('the default indicator is a chevron svg', async () => {
	const { container } = await render(Harness)
	expect(container.querySelector('[data-slot="faq-question"] svg')).toBeTruthy()
})

test('a custom icon snippet replaces the default indicator', async () => {
	const { container } = await render(Harness, { useIcon: true })
	// Both questions render the custom icon (and thus not the default chevron).
	expect(container.querySelectorAll('[data-testid="custom-icon"]').length).toBe(2)
})

test('iconRotate sets the --faq-icon-rotate CSS var', async () => {
	const { container } = await render(Harness, { iconRotate: 45 })
	const span = container.querySelector('[data-slot="faq-question"] span')
	expect(span?.getAttribute('style')).toContain('--faq-icon-rotate: 45deg')
})

test('{@html} answer renders HTML markup', async () => {
	const { container } = await render(Harness)
	await page.getByRole('button', { name: /Question One/ }).click()
	await vi.waitFor(() =>
		expect(container.querySelector('[data-slot="faq-answer"] strong')?.textContent).toBe('Bravo')
	)
})
