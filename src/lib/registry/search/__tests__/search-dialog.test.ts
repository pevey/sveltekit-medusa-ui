import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test, vi } from 'vitest'
import type { SearchFn, SearchHit } from '$lib/components/ui/search/ctx.svelte.js'
import SearchDialog from '$lib/components/ui/search/search-dialog.svelte'
import TriggerHarness from './search-dialog-trigger-harness.svelte'

const mk = (type: string, id: string, title: string): SearchHit => ({
	type,
	id,
	slug: `${type}-${id}`,
	group_slug: null,
	title,
	snippet: null,
	score: 1
})

const noHits: SearchFn = async () => ({ hits: [] })

function winKey(init: KeyboardEventInit) {
	window.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }))
}

test('Ctrl+K opens the dialog', async () => {
	render(SearchDialog, { search: noHits })
	expect(page.getByRole('dialog').query()).toBeNull()
	winKey({ key: 'k', ctrlKey: true })
	await expect.element(page.getByRole('dialog')).toBeInTheDocument()
})

test('Cmd+K (metaKey) opens the dialog', async () => {
	render(SearchDialog, { search: noHits })
	winKey({ key: 'k', metaKey: true })
	await expect.element(page.getByRole('dialog')).toBeInTheDocument()
})

test('enabled=false disables the global shortcut', async () => {
	render(SearchDialog, { search: noHits, enabled: false })
	winKey({ key: 'k', ctrlKey: true })
	await new Promise((r) => setTimeout(r, 50))
	expect(page.getByRole('dialog').query()).toBeNull()
})

test('the trigger snippet opens the dialog', async () => {
	render(TriggerHarness, { search: noHits })
	expect(page.getByRole('dialog').query()).toBeNull()
	await page.getByTestId('open-btn').click()
	await expect.element(page.getByRole('dialog')).toBeInTheDocument()
})

test('the search input is focused when the dialog opens', async () => {
	render(SearchDialog, { search: noHits })
	winKey({ key: 'k', ctrlKey: true })
	const input = page.getByRole('combobox')
	await expect.element(input).toBeInTheDocument()
	await vi.waitFor(() => expect(document.activeElement).toBe(input.element()))
})

test('typing shows results as options and ArrowDown highlights the first', async () => {
	render(SearchDialog, {
		search: async () => ({ hits: [mk('product', '1', 'Coffee'), mk('product', '2', 'Beans')] }),
		debounce: 0
	})
	winKey({ key: 'k', ctrlKey: true })
	const input = page.getByRole('combobox')
	await input.fill('coffee')
	const first = page.getByRole('option', { name: /Coffee/ })
	await expect.element(first).toBeInTheDocument()
	input.element().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
	await expect.element(first).toHaveAttribute('aria-selected', 'true')
})

test('Escape closes the dialog', async () => {
	render(SearchDialog, { search: noHits })
	winKey({ key: 'k', ctrlKey: true })
	await expect.element(page.getByRole('dialog')).toBeInTheDocument()
	page
		.getByRole('combobox')
		.element()
		.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
	await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
})
