import { expect, test } from 'vitest'
import * as Collections from '../index.js'

test('exports the documented surface', () => {
	for (const name of ['Root', 'Grid', 'Card', 'Pagination']) {
		expect(Collections[name as keyof typeof Collections]).toBeDefined()
	}
	expect(Collections.Pagination.Prev).toBeDefined()
	expect(Collections.getCollectionsContext).toBeTypeOf('function')
})
