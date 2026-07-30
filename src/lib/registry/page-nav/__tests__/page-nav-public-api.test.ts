import { expect, test } from 'vitest'
import * as PageNav from '../index.js'

test('exports the documented surface', () => {
	for (const name of ['Root', 'Prev', 'Next', 'Pages', 'Info']) {
		expect(PageNav[name as keyof typeof PageNav]).toBeDefined()
	}
	expect(PageNav.logic.pageCount).toBeTypeOf('function')
	expect(PageNav.setPageNavContext).toBeTypeOf('function')
})
