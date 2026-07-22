import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import type { SearchHit } from '$lib/components/ui/search/ctx.svelte.js'
import Harness from './a11y-harness.svelte'

const mk = (type: string, id: string, title: string): SearchHit => ({
	type,
	id,
	slug: `${type}-${id}`,
	group_slug: null,
	title,
	snippet: null,
	score: 1
})

// Two products (rendered first, headerless) + one category (grouped) → visual/nav
// order is [Coffee, Beans, Roasts].
const hits = [mk('product', '1', 'Coffee'), mk('product', '2', 'Beans'), mk('category', '3', 'Roasts')]

function keydown(key: string) {
	page
		.getByRole('combobox')
		.element()
		.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

test('input exposes combobox semantics wired to the listbox', async () => {
	render(Harness, { hits })
	const input = page.getByRole('combobox')
	await expect.element(input).toHaveAttribute('aria-expanded', 'true')
	await expect.element(input).toHaveAttribute('aria-autocomplete', 'list')
	const listbox = page.getByRole('listbox')
	await expect.element(listbox).toBeInTheDocument()
	await expect.element(input).toHaveAttribute('aria-controls', listbox.element().id)
})

test('results are exposed as listbox options in visual order', async () => {
	render(Harness, { hits })
	await expect.element(page.getByRole('option', { name: /Coffee/ })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: /Beans/ })).toBeInTheDocument()
	await expect.element(page.getByRole('option', { name: /Roasts/ })).toBeInTheDocument()
})

test('ArrowDown highlights the first option and sets aria-activedescendant', async () => {
	render(Harness, { hits })
	keydown('ArrowDown')
	const first = page.getByRole('option', { name: /Coffee/ })
	await expect.element(first).toHaveAttribute('aria-selected', 'true')
	await expect.element(page.getByRole('combobox')).toHaveAttribute(
		'aria-activedescendant',
		first.element().id
	)
})

test('ArrowDown walks products then groups; ArrowUp steps back', async () => {
	render(Harness, { hits })
	keydown('ArrowDown') // Coffee
	keydown('ArrowDown') // Beans
	keydown('ArrowDown') // Roasts (category — after both products)
	await expect.element(page.getByRole('option', { name: /Roasts/ })).toHaveAttribute(
		'aria-selected',
		'true'
	)
	keydown('ArrowUp') // back to Beans
	await expect.element(page.getByRole('option', { name: /Beans/ })).toHaveAttribute(
		'aria-selected',
		'true'
	)
})

test('ArrowUp from no selection wraps to the last option', async () => {
	render(Harness, { hits })
	keydown('ArrowUp')
	await expect.element(page.getByRole('option', { name: /Roasts/ })).toHaveAttribute(
		'aria-selected',
		'true'
	)
})

test('Escape closes the dropdown', async () => {
	render(Harness, { hits })
	await expect.element(page.getByRole('listbox')).toBeInTheDocument()
	keydown('Escape')
	await expect.element(page.getByRole('listbox')).not.toBeInTheDocument()
})
