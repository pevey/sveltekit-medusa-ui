import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi } from 'vitest'
import Harness from './reviews-sort-harness.svelte'

test('renders a sort select with the current order when there are reviews', async () => {
	await render(Harness, { count: 3, order: '-rating', setOrder: vi.fn() })
	await expect.element(page.getByText('Sort by:')).toBeInTheDocument()
	await expect.element(page.getByRole('combobox')).toHaveValue('-rating')
})

test('changing the select calls setOrder with the chosen value', async () => {
	const setOrder = vi.fn()
	await render(Harness, { count: 3, order: '-created_at', setOrder })
	await page.getByRole('combobox').selectOptions('Highest rated')
	expect(setOrder).toHaveBeenCalledWith('-rating')
})

test('renders nothing when there are no reviews', async () => {
	const { container } = await render(Harness, { count: 0, setOrder: vi.fn() })
	expect(container.querySelector('select')).toBeNull()
})
