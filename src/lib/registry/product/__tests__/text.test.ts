import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import { page } from '$app/state'
import type { StoreProduct } from '@medusajs/types'
import Harness from './text-harness.svelte'

const product = {
	id: 'p', title: 'Coffee Mug', subtitle: 'Ceramic', options: [],
	variants: [{ id: 'v', options: [], manage_inventory: false }]
} as unknown as StoreProduct

test('renders the title and subtitle', async () => {
	page.url = new URL('http://localhost/')
	render(Harness, { product })
	await expect.element(vpage.getByRole('heading', { name: 'Coffee Mug' })).toBeInTheDocument()
	await expect.element(vpage.getByText('Ceramic')).toBeInTheDocument()
})
