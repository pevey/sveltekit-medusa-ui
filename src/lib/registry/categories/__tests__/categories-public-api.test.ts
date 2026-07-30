import { expect, test } from 'vitest'
import * as Categories from '../index.js'

test('exports the documented surface', () => {
	for (const name of ['Root', 'Grid', 'Card', 'Pagination']) {
		expect(Categories[name as keyof typeof Categories]).toBeDefined()
	}
	expect(Categories.Pagination.Prev).toBeDefined()
	expect(Categories.getCategoriesContext).toBeTypeOf('function')
})
