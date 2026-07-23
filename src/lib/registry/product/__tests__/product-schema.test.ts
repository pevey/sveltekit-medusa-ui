import { describe, it, expect } from 'vitest'
import { productSchema } from '$lib/components/ui/product/product-schema.js'
import type { StoreProduct } from '@medusajs/types'

const cp = (amount: number) => ({ calculated_amount: amount, currency_code: 'usd' })
const mk = (over: Partial<StoreProduct>) => ({ title: 'Tee', ...over }) as unknown as StoreProduct

describe('productSchema', () => {
	it('returns null for null product', () => { expect(productSchema(null)).toBeNull() })

	it('maps name/description/image', () => {
		const s = productSchema(mk({ description: 'Soft', images: [{ url: 'a.jpg' } as any], variants: [] }))!
		expect(s['@type']).toBe('Product')
		expect(s.name).toBe('Tee')
		expect(s.description).toBe('Soft')
		expect(s.image).toEqual(['a.jpg'])
	})

	it('single variant → Offer with price/currency/availability + sku', () => {
		const s = productSchema(mk({ variants: [{ sku: 'TEE-1', manage_inventory: false, calculated_price: cp(10) } as any] }), { url: 'https://x/p/tee' })!
		expect(s.sku).toBe('TEE-1')
		expect((s.offers as any)['@type']).toBe('Offer')
		expect((s.offers as any).price).toBe(10)
		expect((s.offers as any).priceCurrency).toBe('USD')
		expect((s.offers as any).availability).toBe('https://schema.org/InStock')
		expect((s.offers as any).url).toBe('https://x/p/tee')
	})

	it('multiple variants → AggregateOffer low/high/offerCount, no sku', () => {
		const s = productSchema(mk({ variants: [
			{ manage_inventory: false, calculated_price: cp(10) } as any,
			{ manage_inventory: false, calculated_price: cp(25) } as any
		] }))!
		expect(s.sku).toBeUndefined()
		expect((s.offers as any)['@type']).toBe('AggregateOffer')
		expect((s.offers as any).lowPrice).toBe(10)
		expect((s.offers as any).highPrice).toBe(25)
		expect((s.offers as any).offerCount).toBe(2)
	})

	it('no calculated_price → offers omitted', () => {
		const s = productSchema(mk({ variants: [{ manage_inventory: false } as any] }))!
		expect(s.offers).toBeUndefined()
	})

	it('all OOS → OutOfStock', () => {
		const s = productSchema(mk({ variants: [{ manage_inventory: true, allow_backorder: false, inventory_quantity: 0, calculated_price: cp(10) } as any] }))!
		expect((s.offers as any).availability).toBe('https://schema.org/OutOfStock')
	})

	it('backorderable (managed, 0 stock, allow_backorder) → BackOrder', () => {
		const s = productSchema(mk({ variants: [{ manage_inventory: true, allow_backorder: true, inventory_quantity: 0, calculated_price: cp(10) } as any] }))!
		expect((s.offers as any).availability).toBe('https://schema.org/BackOrder')
	})

	it('non-array review relation → no aggregateRating/review, no throw', () => {
		expect(() => productSchema(mk({ variants: [], review: undefined } as any))).not.toThrow()
		const s = productSchema(mk({ variants: [], review: { status: 'approved', rating: 5 } } as any))!
		expect(s.aggregateRating).toBeUndefined()
		expect(s.review).toBeUndefined()
	})

	it('maps approved reviews → aggregateRating + review[]', () => {
		const s = productSchema(mk({ variants: [], review: [
			{ status: 'approved', rating: 5, title: 'Great', body: 'Love it', author_name: 'Alice', created_at: '2026-01-01' },
			{ status: 'approved', rating: 4, body: 'Good', author_name: 'Bob', created_at: '2026-01-02' },
			{ status: 'pending', rating: 1, body: 'nope', author_name: 'X' }
		] } as any))!
		expect((s.aggregateRating as any).ratingValue).toBe(4.5)   // (5+4)/2, pending excluded
		expect((s.aggregateRating as any).reviewCount).toBe(2)
		expect((s.review as any[]).length).toBe(2)
		expect((s.review as any[])[0].reviewRating.ratingValue).toBe(5)
		expect((s.review as any[])[0].author.name).toBe('Alice')
	})

	it('no reviews → no aggregateRating/review', () => {
		const s = productSchema(mk({ variants: [] }))!
		expect(s.aggregateRating).toBeUndefined()
		expect(s.review).toBeUndefined()
	})
})
