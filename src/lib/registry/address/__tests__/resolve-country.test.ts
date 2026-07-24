import { expect, test } from 'vitest'
import { resolveCountryValue } from '../address-logic'

const COUNTRIES = [
	{ code: 'us', name: 'United States' },
	{ code: 'ca', name: 'Canada' },
	{ code: 'gb', name: 'United Kingdom' }
]

test('maps a country display name to its iso_2 code', () => {
	expect(resolveCountryValue(COUNTRIES, 'United States')).toBe('us')
})
test('passes through a value that is already an iso_2 code', () => {
	expect(resolveCountryValue(COUNTRIES, 'us')).toBe('us')
})
test('is case-insensitive on name and code', () => {
	expect(resolveCountryValue(COUNTRIES, 'canada')).toBe('ca')
	expect(resolveCountryValue(COUNTRIES, 'GB')).toBe('gb')
})
test('returns the raw string when nothing matches', () => {
	expect(resolveCountryValue(COUNTRIES, 'Atlantis')).toBe('Atlantis')
})
test('returns empty input unchanged', () => {
	expect(resolveCountryValue(COUNTRIES, '')).toBe('')
})
