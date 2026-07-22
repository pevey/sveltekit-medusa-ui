import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import { page } from '$app/state'
import type { StoreProduct } from '@medusajs/types'
import Harness from './description-harness.svelte'

const mk = (description: string) =>
	({ id: 'p', title: 'x', description, options: [], variants: [{ id: 'v', options: [], manage_inventory: false }] } as unknown as StoreProduct)

test('renders allowed HTML', async () => {
	page.url = new URL('http://localhost/')
	render(Harness, { product: mk('<p>Rich <strong>text</strong>.</p>') })
	await expect.element(vpage.getByText('text')).toBeInTheDocument()
})

test('strips scripts / event handlers (sanitized)', async () => {
	page.url = new URL('http://localhost/')
	const { container } = await render(Harness, {
		product: mk('<p onclick="evil()">safe</p><script>evil()</' + 'script>')
	})
	expect(container.querySelector('script')).toBeNull()
	expect(container.querySelector('[onclick]')).toBeNull()
	await expect.element(vpage.getByText('safe')).toBeInTheDocument()
})
