import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi } from 'vitest'
import Harness from './reviews-pagination-harness.svelte'

test('renders nav + info when filteredCount exceeds pageSize', async () => {
	const { container } = await render(Harness, { filteredCount: 25, pageSize: 10, setPage: vi.fn() })
	expect(container.querySelector('[data-pagination]')).not.toBeNull()
	await expect.element(page.getByText('Page 1 of 3')).toBeInTheDocument()
})

test('renders nothing when filteredCount is within a single page', async () => {
	const { container } = await render(Harness, { filteredCount: 5, pageSize: 10, setPage: vi.fn() })
	expect(container.querySelector('[data-pagination]')).toBeNull()
})

test('Next calls setPage(page + 1) and stays enabled before the last page', async () => {
	const setPage = vi.fn()
	await render(Harness, { filteredCount: 25, pageSize: 10, page: 0, setPage })
	await expect.element(page.getByRole('button', { name: 'Next page' })).not.toBeDisabled()
	await page.getByRole('button', { name: 'Next page' }).click()
	expect(setPage).toHaveBeenCalledWith(1)
})

test('Next is disabled on the last page', async () => {
	await render(Harness, { filteredCount: 25, pageSize: 10, page: 2, setPage: vi.fn() })
	await expect.element(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
})

test('Prev is disabled on the first page', async () => {
	await render(Harness, { filteredCount: 25, pageSize: 10, page: 0, setPage: vi.fn() })
	await expect.element(page.getByRole('button', { name: 'Previous page' })).toBeDisabled()
})

test('Prev calls setPage(page - 1) when not on the first page', async () => {
	const setPage = vi.fn()
	await render(Harness, { filteredCount: 25, pageSize: 10, page: 1, setPage })
	await expect.element(page.getByRole('button', { name: 'Previous page' })).not.toBeDisabled()
	await page.getByRole('button', { name: 'Previous page' }).click()
	expect(setPage).toHaveBeenCalledWith(0)
})
