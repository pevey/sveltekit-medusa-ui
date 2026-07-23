import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Harness from './line-item-subtotal-harness.svelte'

const cart = (items: any[]) => () => ({ current: { id: 'c', items } }) as any

test('shows the Medusa-computed line subtotal', async () => {
	await render(Harness, { getCart: cart([{ id: 'li1', quantity: 2, unit_price: 10, subtotal: 20, currency_code: 'usd' }]) })
	await expect.element(vpage.getByText('$20.00')).toBeInTheDocument()
})

test('falls back to unit_price × quantity when subtotal is absent', async () => {
	await render(Harness, { getCart: cart([{ id: 'li1', quantity: 3, unit_price: 10, currency_code: 'usd' }]) })
	await expect.element(vpage.getByText('$30.00')).toBeInTheDocument()
})
