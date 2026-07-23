import { describe, it, expect } from 'vitest'
import { resolveVariantId, resolveQuantity, findCartLine, cartSatisfiesCondition } from '$lib/components/ui/cta/add-to-cart-logic.js'
import type { StoreCart } from '@medusajs/types'
import type { ProductContext } from '$lib/components/ui/product/ctx.svelte.js'

const ctx = (over: Partial<ProductContext>) => over as ProductContext
const cart = (items: any[]) => ({ id: 'c', items } as unknown as StoreCart)

describe('resolveVariantId', () => {
	it('prefers explicit prop', () => {
		expect(resolveVariantId('p', ctx({ selectedVariantId: 'c' }))).toBe('p')
	})
	it('falls back to context', () => {
		expect(resolveVariantId(undefined, ctx({ selectedVariantId: 'c' }))).toBe('c')
	})
	it('empty context id coalesces to undefined', () => {
		expect(resolveVariantId(undefined, ctx({ selectedVariantId: '' }))).toBeUndefined()
	})
	it('no prop, no context → undefined', () => {
		expect(resolveVariantId(undefined, null)).toBeUndefined()
	})
})

describe('resolveQuantity', () => {
	it('prefers explicit prop', () => { expect(resolveQuantity(3, ctx({ quantity: 2 }))).toBe(3) })
	it('falls back to context', () => { expect(resolveQuantity(undefined, ctx({ quantity: 2 }))).toBe(2) })
	it('defaults to 1', () => { expect(resolveQuantity(undefined, null)).toBe(1) })
})

describe('findCartLine', () => {
	it('matches by variant_id', () => {
		expect(findCartLine(cart([{ id: 'li1', variant_id: 'v1' }]), 'v1')?.id).toBe('li1')
	})
	it('returns undefined for no match / no cart / no variant', () => {
		expect(findCartLine(cart([{ id: 'li1', variant_id: 'v1' }]), 'v2')).toBeUndefined()
		expect(findCartLine(null, 'v1')).toBeUndefined()
		expect(findCartLine(cart([]), undefined)).toBeUndefined()
	})
})

describe('cartSatisfiesCondition', () => {
	const c = cart([
		{ variant_id: 'v1', product_id: 'p1', product_handle: 'tee', product_collection: 'Warby Parker', quantity: 2 }
	])
	it('variantId match', () => { expect(cartSatisfiesCondition(c, { variantId: 'v1' })).toBe(true) })
	it('productId match', () => { expect(cartSatisfiesCondition(c, { productId: 'p1' })).toBe(true) })
	it('productSlug match', () => { expect(cartSatisfiesCondition(c, { productSlug: 'tee' })).toBe(true) })
	it('collectionTitle is case-insensitive', () => {
		expect(cartSatisfiesCondition(c, { collectionTitle: 'warby parker' })).toBe(true)
	})
	it('respects minQuantity threshold', () => {
		expect(cartSatisfiesCondition(c, { variantId: 'v1', minQuantity: 2 })).toBe(true)
		expect(cartSatisfiesCondition(c, { variantId: 'v1', minQuantity: 3 })).toBe(false)
	})
	it('no match → false', () => { expect(cartSatisfiesCondition(c, { variantId: 'zzz' })).toBe(false) })
	it('empty condition → false', () => { expect(cartSatisfiesCondition(c, {})).toBe(false) })
})
