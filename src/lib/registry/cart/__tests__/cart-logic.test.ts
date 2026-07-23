import { describe, it, expect } from 'vitest'
import { totalQuantity, lineCount, subtotal, defaultLineHref } from '$lib/components/ui/cart/cart-logic.js'
import type { StoreCart } from '@medusajs/types'

const cart = (items: any[], extra: any = {}) => ({ id: 'c', items, ...extra } as unknown as StoreCart)

describe('totalQuantity', () => {
	it('sums line quantities', () => {
		expect(totalQuantity(cart([{ quantity: 2 }, { quantity: 3 }]))).toBe(5)
	})
	it('is 0 for empty / null', () => {
		expect(totalQuantity(cart([]))).toBe(0)
		expect(totalQuantity(null)).toBe(0)
		expect(totalQuantity(undefined)).toBe(0)
	})
})

describe('lineCount', () => {
	it('counts distinct lines', () => { expect(lineCount(cart([{ quantity: 2 }, { quantity: 3 }]))).toBe(2) })
	it('is 0 for empty / null', () => { expect(lineCount(null)).toBe(0) })
})

describe('subtotal', () => {
	it('returns item_subtotal', () => { expect(subtotal(cart([], { item_subtotal: 40 }))).toBe(40) })
	it('is undefined when absent', () => { expect(subtotal(cart([]))).toBeUndefined() })
	it('is undefined for null cart', () => { expect(subtotal(null)).toBeUndefined() })
})

describe('defaultLineHref', () => {
	it('builds product href with variant', () => {
		expect(defaultLineHref({ product_handle: 'tee', variant_id: 'v1' } as any)).toBe('/product/tee?variant=v1')
	})
	it('omits variant when absent', () => {
		expect(defaultLineHref({ product_handle: 'tee' } as any)).toBe('/product/tee')
	})
})
