import { describe, it, expect } from 'vitest'
import { formatPrice } from '$lib/components/ui/product/format-price.js'

describe('formatPrice', () => {
	it('formats using the calculated_price currency (major units)', () => {
		expect(formatPrice({ calculated_amount: 10, original_amount: 10, currency_code: 'usd' })).toBe('$10.00')
	})
	it('returns empty string for missing price', () => {
		expect(formatPrice(undefined)).toBe('')
		expect(formatPrice(null)).toBe('')
	})
})
