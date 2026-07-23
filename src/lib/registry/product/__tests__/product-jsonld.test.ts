import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import { page } from '$app/state'
import type { StoreProduct } from '@medusajs/types'
import Harness from './product-jsonld-harness.svelte'

const product = { id: 'p', title: 'Tee', options: [], variants: [{ id: 'v', options: [], sku: 'TEE-1', manage_inventory: false, calculated_price: { calculated_amount: 10, currency_code: 'usd' } }] } as unknown as StoreProduct

function ld() {
	const el = [...document.head.querySelectorAll('script[type="application/ld+json"]')].pop() as HTMLScriptElement
	return JSON.parse(el.textContent!)
}

test('emits a Product JSON-LD from context', async () => {
	page.url = new URL('http://localhost/product/tee')
	await render(Harness, { product })
	const d = ld()
	expect(d['@type']).toBe('Product')
	expect(d.name).toBe('Tee')
	expect(d.offers.price).toBe(10)
	expect(d.offers.url).toBe('http://localhost/product/tee')
})

test('override shallow-replaces a key', async () => {
	page.url = new URL('http://localhost/product/tee')
	await render(Harness, { product, override: { brand: { '@type': 'Brand', name: 'Acme' } } as any })
	expect(ld().brand.name).toBe('Acme')
})

test('transform runs last over the merged schema', async () => {
	page.url = new URL('http://localhost/product/tee')
	await render(Harness, { product, transform: (s: any) => ({ ...s, sku: 'OVERRIDDEN' }) })
	expect(ld().sku).toBe('OVERRIDDEN')
})
