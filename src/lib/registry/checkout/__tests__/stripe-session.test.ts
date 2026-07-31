import { expect, test } from 'vitest'
import { toMinorUnits, canMountElements } from '$lib/components/ui/checkout/stripe-session.js'

test('two-decimal currencies convert major → minor units', () => {
	expect(toMinorUnits(20, 'usd')).toBe(2000)
	expect(toMinorUnits(20.5, 'eur')).toBe(2050)
	expect(toMinorUnits(0.99, 'gbp')).toBe(99)
})

test('zero-decimal currencies pass the amount through', () => {
	expect(toMinorUnits(1200, 'jpy')).toBe(1200)
	expect(toMinorUnits(5000, 'krw')).toBe(5000)
	expect(toMinorUnits(1000, 'vnd')).toBe(1000)
})

test('three-decimal currencies convert to thousandths', () => {
	expect(toMinorUnits(1.5, 'kwd')).toBe(1500)
	expect(toMinorUnits(20, 'bhd')).toBe(20000)
})

test('currency code casing does not matter', () => {
	expect(toMinorUnits(20, 'USD')).toBe(2000)
	expect(toMinorUnits(1200, 'JPY')).toBe(1200)
})

test('floating-point totals round rather than truncate', () => {
	// 20.499999999999996 is the kind of value that falls out of Medusa's tax/discount maths.
	expect(toMinorUnits(20.499999999999996, 'usd')).toBe(2050)
	expect(toMinorUnits(0.1 + 0.2, 'usd')).toBe(30)
})

test('an unknown currency falls back to two decimals', () => {
	expect(toMinorUnits(20, 'xyz')).toBe(2000)
	expect(toMinorUnits(20, '')).toBe(2000)
})

test('canMountElements rejects amounts Stripe would refuse', () => {
	// Stripe requires a positive integer amount in deferred mode; an empty cart must not mount.
	expect(canMountElements(2000)).toBe(true)
	expect(canMountElements(1)).toBe(true)
	expect(canMountElements(0)).toBe(false)
	expect(canMountElements(-100)).toBe(false)
	expect(canMountElements(20.5)).toBe(false)
	expect(canMountElements(null)).toBe(false)
	expect(canMountElements(undefined)).toBe(false)
})
