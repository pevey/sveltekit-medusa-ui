import { expect, test } from 'vitest'
import { resolveProvince, resolveProvinceValue, defaultProvinceConfig, US_STATES, CA_PROVINCES, US_MILITARY } from '../provinces'

test('resolveProvince returns select mode with label + options for a configured country', () => {
	const r = resolveProvince(defaultProvinceConfig, 'us')
	expect(r).toEqual({ mode: 'select', label: 'State', options: US_STATES })
})

test('resolveProvince is case-insensitive on country', () => {
	expect(resolveProvince(defaultProvinceConfig, 'CA')).toEqual({ mode: 'select', label: 'Province', options: CA_PROVINCES })
})

test('resolveProvince returns text mode for an unconfigured or empty country', () => {
	expect(resolveProvince(defaultProvinceConfig, 'gb')).toEqual({ mode: 'text' })
	expect(resolveProvince(defaultProvinceConfig, '')).toEqual({ mode: 'text' })
	expect(resolveProvince(defaultProvinceConfig, undefined)).toEqual({ mode: 'text' })
})

test('US_STATES values are lowercased ISO 3166-2 and military codes exist separately', () => {
	expect(US_STATES.find((s) => s.value === 'us-ca')?.label).toBe('California')
	expect(US_STATES.some((s) => s.value === 'us-aa')).toBe(false)
	expect(US_MILITARY.map((s) => s.value)).toEqual(['us-aa', 'us-ae', 'us-ap'])
})

test('resolveProvinceValue maps a full province name to its ISO option value', () => {
	expect(resolveProvinceValue(defaultProvinceConfig, 'us', 'California')).toBe('us-ca')
})
test('resolveProvinceValue passes through a value that is already an ISO code', () => {
	expect(resolveProvinceValue(defaultProvinceConfig, 'us', 'us-ca')).toBe('us-ca')
})
test('resolveProvinceValue is case-insensitive on country and province', () => {
	expect(resolveProvinceValue(defaultProvinceConfig, 'US', 'california')).toBe('us-ca')
})
test('resolveProvinceValue returns the raw string for a freeform (unconfigured) country', () => {
	expect(resolveProvinceValue(defaultProvinceConfig, 'gb', 'Greater London')).toBe('Greater London')
})
test('resolveProvinceValue returns the raw string when no option matches', () => {
	expect(resolveProvinceValue(defaultProvinceConfig, 'us', 'Nowhere')).toBe('Nowhere')
})
test('resolveProvinceValue returns empty input unchanged', () => {
	expect(resolveProvinceValue(defaultProvinceConfig, 'us', '')).toBe('')
})
