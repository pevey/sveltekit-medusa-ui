import { render } from 'vitest-browser-svelte'
import { page as browser } from 'vitest/browser'
import { expect, test, beforeEach } from 'vitest'
import { page } from '$app/state'
import Harness from './product-local-selection-harness.svelte'

const price = (amount: number) => ({ calculated_amount: amount, original_amount: amount, currency_code: 'usd' })

const product = {
	id: 'prod_1',
	title: 'Tee',
	handle: 'tee',
	options: [
		{
			id: 'opt_size',
			title: 'Size',
			values: [
				{ id: 'val_s', value: 'S', rank: 0 },
				{ id: 'val_m', value: 'M', rank: 1 }
			]
		}
	],
	variants: [
		{ id: 'v_s', manage_inventory: false, calculated_price: price(10), options: [{ id: 'val_s', option_id: 'opt_size' }] },
		{ id: 'v_m', manage_inventory: false, calculated_price: price(20), options: [{ id: 'val_m', option_id: 'opt_size' }] }
	]
} as never

beforeEach(() => {
	page.url.search = ''
})

// The selected value always renders as a <span aria-current>, and an unavailable value as a
// disabled <span> — only a selectable, available value renders as a link (url mode) or a
// button (local mode). With v_s selected, that is exactly one element: M.
test('renders an anchor for a selectable option value in url mode', async () => {
	const { container } = await render(Harness, { product, selection: 'url' })
	expect(container.querySelectorAll('a[data-value]').length).toBe(1)
	expect(container.querySelectorAll('button[data-value]').length).toBe(0)
	expect(container.querySelector('span[data-selected="true"]')?.textContent?.trim()).toBe('S')
})

test('renders a button for a selectable option value in local mode', async () => {
	const { container } = await render(Harness, { product, selection: 'local' })
	expect(container.querySelectorAll('button[data-value]').length).toBe(1)
	expect(container.querySelectorAll('a[data-value]').length).toBe(0)
})

test('clicking an option button changes the selection without navigating', async () => {
	const { container } = await render(Harness, { product, selection: 'local' })
	expect(container.querySelector('[data-selected]:not([data-value])')?.textContent).toBe('v_s')
	await browser.getByRole('button', { name: 'M' }).click()
	await expect.poll(() => container.querySelector('[data-selected]:not([data-value])')?.textContent).toBe('v_m')
	expect(page.url.search).toBe('')
})

test('QuantitySelect updates local quantity without navigating', async () => {
	const { container } = await render(Harness, { product, selection: 'local' })
	await browser.getByRole('combobox').selectOptions('3')
	await expect.poll(() => container.querySelector('[data-quantity]')?.textContent).toBe('3')
	expect(page.url.search).toBe('')
})
