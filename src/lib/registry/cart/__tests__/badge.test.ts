import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Harness from './badge-harness.svelte'

const withItems = () => ({ current: { id: 'c', items: [{ id: 'a', quantity: 2 }, { id: 'b', quantity: 3 }] } }) as any
const empty = () => ({ current: { id: 'c', items: [] } }) as any

test('badge shows total quantity by default', async () => {
	render(Harness, { getCart: withItems })
	await expect.element(vpage.getByText('5')).toBeInTheDocument()
})

test('badge mode=lines shows distinct line count', async () => {
	render(Harness, { getCart: withItems, mode: 'lines' })
	await expect.element(vpage.getByText('2')).toBeInTheDocument()
})

test('badge renders nothing when cart is empty', async () => {
	const { container } = await render(Harness, { getCart: empty })
	expect(container.querySelector('[data-cart-badge]')).toBeNull()
})
