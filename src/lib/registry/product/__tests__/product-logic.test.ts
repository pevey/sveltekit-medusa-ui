import { describe, it, expect } from 'vitest'
import {
	resolveVariant,
	isAvailable,
	isSelected,
	inStock,
	defaultVariantId
} from '$lib/components/ui/product/product-logic.js'
import type { StoreProduct, StoreProductVariant } from '@medusajs/types'

// options Color(red,blue) x Size(S,M). 4 variants; mixed stock.
const OV = (id: string, value: string, option_id: string) => ({ id, value, option_id }) as never
function fixture(): StoreProduct {
	const variants: Partial<StoreProductVariant>[] = [
		{ id: 'v_rs', options: [OV('red', 'red', 'oColor'), OV('s', 'S', 'oSize')], manage_inventory: true, inventory_quantity: 5 },
		{ id: 'v_rm', options: [OV('red', 'red', 'oColor'), OV('m', 'M', 'oSize')], manage_inventory: true, inventory_quantity: 0 },
		{ id: 'v_bs', options: [OV('blue', 'blue', 'oColor'), OV('s', 'S', 'oSize')], manage_inventory: false, inventory_quantity: null },
		{ id: 'v_bm', options: [OV('blue', 'blue', 'oColor'), OV('m', 'M', 'oSize')], manage_inventory: true, inventory_quantity: null }
	]
	return {
		id: 'p1', title: 'Tee',
		options: [
			{ id: 'oColor', title: 'Color', values: [{ id: 'red', value: 'red', rank: 1 }, { id: 'blue', value: 'blue', rank: 2 }] },
			{ id: 'oSize', title: 'Size', values: [{ id: 's', value: 'S', rank: 1 }, { id: 'm', value: 'M', rank: 2 }] }
		],
		variants: variants as StoreProductVariant[]
	} as StoreProduct
}
const byId = (p: StoreProduct, id: string) => p.variants?.find((v) => v.id === id) ?? null

describe('product-logic', () => {
	it('defaultVariantId picks the highest-ranked value per option', () => {
		expect(defaultVariantId(fixture())).toBe('v_rs') // rank 1 = red + S
	})

	it('resolveVariant swaps one option, keeping the others', () => {
		const p = fixture(); const sel = byId(p, 'v_rs') // red,S
		expect(resolveVariant(p, sel, 'oColor', 'blue')).toBe('v_bs') // blue,S
		expect(resolveVariant(p, sel, 'oSize', 'm')).toBe('v_rm') // red,M
	})

	it('inStock: manage_inventory false always in stock; else qty>0', () => {
		expect(inStock({ manage_inventory: false, inventory_quantity: null } as StoreProductVariant)).toBe(true)
		expect(inStock({ manage_inventory: true, inventory_quantity: 5 } as StoreProductVariant)).toBe(true)
		expect(inStock({ manage_inventory: true, inventory_quantity: 0 } as StoreProductVariant)).toBe(false)
		expect(inStock({ manage_inventory: true, inventory_quantity: null } as StoreProductVariant)).toBe(false)
	})

	it('isAvailable is relative to the other selected options', () => {
		const p = fixture()
		expect(isAvailable(p, byId(p, 'v_rs'), 's')).toBe(true) // red,S in stock
		expect(isAvailable(p, byId(p, 'v_rs'), 'm')).toBe(false) // red,M qty 0
		expect(isAvailable(p, byId(p, 'v_bs'), 'm')).toBe(false) // blue,M qty null
	})

	it('isSelected reflects the selected variant', () => {
		const sel = byId(fixture(), 'v_rs')
		expect(isSelected(sel, 'red')).toBe(true)
		expect(isSelected(sel, 'blue')).toBe(false)
	})

	it('is order-independent: variant.options order need not match product.options', () => {
		const p = fixture()
		const v = p.variants!.find((x) => x.id === 'v_rm')! // red,M
		v.options = [OV('m', 'M', 'oSize'), OV('red', 'red', 'oColor')] as never // reversed
		const sel = byId(p, 'v_rm')
		expect(resolveVariant(p, sel, 'oColor', 'blue')).toBe('v_bm') // blue + M kept
		expect(isAvailable(p, sel, 's')).toBe(true) // Size S given Color=red → v_rs in stock
	})

	it('resolveVariant works with no prior selection (null variant)', () => {
		expect(resolveVariant(fixture(), null, 'oColor', 'blue')).toBeTruthy()
	})
})
