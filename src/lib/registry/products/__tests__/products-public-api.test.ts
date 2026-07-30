import { expect, test } from 'vitest'
import * as Products from '../index.js'

test('exports the documented surface', () => {
	expect(Products.Root).toBeDefined()
	expect(Products.Grid).toBeDefined()
	expect(Products.Pagination).toBeDefined()
	expect(Products.Pagination.Prev).toBeDefined()
	expect(Products.Pagination.Next).toBeDefined()
	expect(Products.Pagination.Pages).toBeDefined()
	expect(Products.Pagination.Info).toBeDefined()
	expect(Products.getProductsContext).toBeTypeOf('function')
})
