import { render } from 'vitest-browser-svelte'
import { expect, test, beforeEach } from 'vitest'
import { page as appPage } from '$app/state'
import Harness from './page-nav-harness.svelte'

beforeEach(() => {
	appPage.url.pathname = '/shop'
	appPage.url.search = ''
})

test('renders nothing for a single page', async () => {
	const { container } = await render(Harness, { page: 0, pageCount: 1 })
	expect(container.querySelector('[data-page-nav]')).toBeNull()
})

test('renders the nav and info for multiple pages', async () => {
	const { container } = await render(Harness, { page: 0, pageCount: 3 })
	expect(container.querySelector('[data-page-nav]')).not.toBeNull()
	expect(container.querySelector('[data-page-nav-info]')?.textContent).toBe('Page 1 of 3')
})

test('Prev is disabled on the first page and Next links to page 2', async () => {
	const { container } = await render(Harness, { page: 0, pageCount: 3 })
	expect(container.querySelector('[data-page-nav-prev]')?.getAttribute('aria-disabled')).toBe('true')
	expect(container.querySelector('[data-page-nav-next]')?.getAttribute('href')).toBe('/shop?p=2')
})

test('Next is disabled on the last page and Prev drops the param for page 1', async () => {
	const { container } = await render(Harness, { page: 2, pageCount: 3 })
	expect(container.querySelector('[data-page-nav-next]')?.getAttribute('aria-disabled')).toBe('true')
	expect(container.querySelector('[data-page-nav-prev]')?.getAttribute('href')).toBe('/shop?p=2')
})

test('marks the current page with aria-current', async () => {
	const { container } = await render(Harness, { page: 1, pageCount: 3 })
	const current = container.querySelector('[aria-current="page"]')
	expect(current?.textContent).toBe('2')
	expect(container.querySelectorAll('[aria-current="page"]').length).toBe(1)
})

test('page links preserve unrelated search params', async () => {
	appPage.url.search = '?sort=price'
	const { container } = await render(Harness, { page: 0, pageCount: 3 })
	expect(container.querySelector('[data-page-nav-next]')?.getAttribute('href')).toBe('/shop?sort=price&p=2')
})

test('honours a custom page param', async () => {
	const { container } = await render(Harness, { page: 0, pageCount: 3, pageParam: 'page' })
	expect(container.querySelector('[data-page-nav-next]')?.getAttribute('href')).toBe('/shop?page=2')
})

test('elides long ranges with an ellipsis', async () => {
	const { container } = await render(Harness, { page: 0, pageCount: 10 })
	expect(container.querySelectorAll('[data-page-nav-ellipsis]').length).toBe(1)
	expect(container.querySelector('[data-page-nav-page="9"]')?.getAttribute('href')).toBe('/shop?p=10')
})
