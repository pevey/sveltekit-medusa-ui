import { describe, it, expect } from 'vitest'
import * as Product from '../index.js'

describe('Product public API (trimmed to display + Rating)', () => {
	it('exposes the Product display namespace', () => {
		expect(Product.Root).toBeDefined()
		expect(Product.Title).toBeDefined()
		expect(Product.Subtitle).toBeDefined()
		expect(Product.Description).toBeDefined()
		expect(Product.Price).toBeDefined()
		expect(Product.Options).toBeDefined()
		expect(Product.OptionButton).toBeDefined()
		expect(Product.QuantitySelect).toBeDefined()
		expect(Product.JsonLd).toBeDefined()
	})
	it('exposes Product.Rating and Product.Star', () => {
		expect(Product.Rating).toBeDefined()
		expect(Product.Star).toBeDefined()
	})
	it('no longer exposes any reviews-collection compounds (moved to `reviews`)', () => {
		expect((Product as Record<string, unknown>).Reviews).toBeUndefined()
		expect((Product as Record<string, unknown>).FeaturedReviews).toBeUndefined()
		expect((Product as Record<string, unknown>).Carousel).toBeUndefined()
	})
})
