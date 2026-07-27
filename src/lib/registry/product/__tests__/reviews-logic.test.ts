import { expect, test } from 'vitest'
import { averageToStarFills, ratingToStarFills, barFill, pageCount, formatReviewDate } from '../reviews-logic.js'

test('averageToStarFills half-snaps', () => {
	expect(averageToStarFills(4.2)).toEqual([1, 1, 1, 1, 0]) // 4.2 -> 4.0
	expect(averageToStarFills(4.25)).toEqual([1, 1, 1, 1, 0.5]) // 4.25 -> 4.5
	expect(averageToStarFills(0)).toEqual([0, 0, 0, 0, 0])
	expect(averageToStarFills(5)).toEqual([1, 1, 1, 1, 1])
})
test('ratingToStarFills is integer', () => {
	expect(ratingToStarFills(3)).toEqual([1, 1, 1, 0, 0])
})
test('barFill guards divide-by-zero', () => {
	expect(barFill(3, 12)).toBe(0.25)
	expect(barFill(0, 0)).toBe(0)
})
test('pageCount ceilings', () => {
	expect(pageCount(21, 10)).toBe(3)
	expect(pageCount(0, 10)).toBe(0)
})
test('formatReviewDate handles bad input', () => {
	expect(formatReviewDate('not-a-date')).toBe('')
	expect(formatReviewDate('2026-01-15T00:00:00Z', 'en-US')).toContain('2026')
})
