import { describe, it, expect } from 'vitest'
import { componentsToAddress } from '../address'

// Minimal shape matching google.maps.places.AddressComponent (longText/shortText/types).
const comp = (types: string[], longText: string, shortText = longText) =>
	({ types, longText, shortText }) as any

describe('componentsToAddress', () => {
	it('maps a full component set to a normalized address', () => {
		const out = componentsToAddress([
			comp(['street_number'], '123'),
			comp(['route'], 'Main St'),
			comp(['subpremise'], 'Apt 4'),
			comp(['locality'], 'Springfield'),
			comp(['administrative_area_level_1'], 'Illinois', 'IL'),
			comp(['postal_code'], '62704'),
			comp(['country'], 'United States', 'US')
		])
		expect(out).toEqual({
			address_1: '123 Main St',
			address_2: 'Apt 4',
			city: 'Springfield',
			province: 'Illinois',
			postal_code: '62704',
			country_code: 'us'
		})
	})

	it('falls back to postal_town for city and trims address_1 when street_number is absent', () => {
		const out = componentsToAddress([
			comp(['route'], 'High Street'),
			comp(['postal_town'], 'Cambridge'),
			comp(['country'], 'United Kingdom', 'GB')
		])
		expect(out.address_1).toBe('High Street')
		expect(out.city).toBe('Cambridge')
		expect(out.country_code).toBe('gb')
	})

	it('returns empty strings for missing components', () => {
		expect(componentsToAddress([])).toEqual({
			address_1: '', address_2: '', city: '', province: '', postal_code: '', country_code: ''
		})
	})
})
