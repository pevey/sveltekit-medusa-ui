import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import { CartDrawer } from '$lib/components/ui/cart'

const getCart = () => ({ current: { id: 'c', items: [{ id: 'a', quantity: 2 }] } }) as any

test('CartDrawer renders a trigger with the badge count', async () => {
	render(CartDrawer, { getCart })
	// The trigger + badge render even before the sheet opens.
	await expect.element(vpage.getByText('2')).toBeInTheDocument()
	await expect.element(vpage.getByText('Cart')).toBeInTheDocument()
})
