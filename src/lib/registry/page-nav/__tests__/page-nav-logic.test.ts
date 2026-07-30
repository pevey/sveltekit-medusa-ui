import { describe, expect, it } from 'vitest'
import { pageCount, parsePage, buildPageHref, pageWindow } from '../page-nav-logic.js'

describe('pageCount', () => {
	it('rounds up', () => {
		expect(pageCount(25, 10)).toBe(3)
	})
	it('is 0 for an empty result set', () => {
		expect(pageCount(0, 10)).toBe(0)
	})
	it('is 0 for a non-positive page size', () => {
		expect(pageCount(10, 0)).toBe(0)
	})
})

describe('parsePage', () => {
	it('converts the 1-based param to a 0-based index', () => {
		expect(parsePage('3')).toBe(2)
	})
	it('treats a missing param as page 0', () => {
		expect(parsePage(null)).toBe(0)
	})
	it('treats garbage, 0 and negatives as page 0', () => {
		expect(parsePage('abc')).toBe(0)
		expect(parsePage('0')).toBe(0)
		expect(parsePage('-4')).toBe(0)
	})
})

describe('buildPageHref', () => {
	it('omits the param for page 0', () => {
		expect(buildPageHref(new URL('http://x.test/shop?page=3'), 'page', 0)).toBe('/shop')
	})
	it('writes a 1-based param', () => {
		expect(buildPageHref(new URL('http://x.test/shop'), 'page', 2)).toBe('/shop?page=3')
	})
	it('preserves unrelated search params', () => {
		expect(buildPageHref(new URL('http://x.test/shop?sort=price&page=2'), 'page', 4)).toBe('/shop?sort=price&page=5')
	})
	it('honours a custom param name', () => {
		expect(buildPageHref(new URL('http://x.test/shop'), 'p', 1)).toBe('/shop?p=2')
	})
	it("accepts SvelteKit's readonly page.url shape, not just a real URL", () => {
		// page.url.searchParams is a ReadonlyURLSearchParams in a real app — see PageUrl.
		const readonlyish = { pathname: '/shop', searchParams: { toString: () => 'sort=price' } }
		expect(buildPageHref(readonlyish, 'page', 1)).toBe('/shop?sort=price&page=2')
	})
})

describe('pageWindow', () => {
	it('lists every page when the count is small', () => {
		expect(pageWindow(0, 3, 1)).toEqual([0, 1, 2])
	})
	it('is empty when there are no pages', () => {
		expect(pageWindow(0, 0, 1)).toEqual([])
	})
	it('truncates the tail with an ellipsis', () => {
		expect(pageWindow(0, 10, 1)).toEqual([0, 1, 'ellipsis', 9])
	})
	it('truncates the head with an ellipsis', () => {
		expect(pageWindow(9, 10, 1)).toEqual([0, 'ellipsis', 8, 9])
	})
	it('truncates both sides in the middle', () => {
		expect(pageWindow(5, 12, 1)).toEqual([0, 'ellipsis', 4, 5, 6, 'ellipsis', 11])
	})
})
