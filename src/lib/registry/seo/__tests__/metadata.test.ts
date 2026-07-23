import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import { page } from '$app/state'
import Harness from './metadata-harness.svelte'

const meta = (name: string) => document.head.querySelector(`meta[name="${name}"]`)?.getAttribute('content')
const prop = (p: string) => document.head.querySelector(`meta[property="${p}"]`)?.getAttribute('content')
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')

test('merges page config over provider defaults; applies title template off-home', async () => {
	page.url = new URL('http://localhost/products/tee')
	await render(Harness, {
		site: { siteName: 'Acme', siteUrl: 'https://acme.com', titleTemplate: '%s | Acme', description: 'default desc', twitterHandle: '@acme' },
		config: { title: 'Tee', description: 'A nice tee' }
	})
	expect(document.title).toBe('Tee | Acme')
	expect(meta('description')).toBe('A nice tee')
	expect(canonical()).toBe('https://acme.com/products/tee')
	expect(prop('og:title')).toBe('Tee | Acme')
	expect(prop('og:site_name')).toBe('Acme')
	expect(meta('twitter:creator')).toBe('@acme')
})

test('home route does not apply the title template', async () => {
	page.url = new URL('http://localhost/')
	await render(Harness, { site: { siteName: 'Acme', titleTemplate: '%s | Acme' }, config: {} })
	expect(document.title).toBe('Acme')
})

test('noindex gates the robots tag', async () => {
	page.url = new URL('http://localhost/x')
	await render(Harness, { site: {}, config: { title: 'X', noindex: true } })
	expect(meta('robots')).toBe('noindex')
})

test('ogType overrides the default og:type', async () => {
	page.url = new URL('http://localhost/products/tee')
	await render(Harness, { site: {}, config: { title: 'P', ogType: 'product' } })
	expect(prop('og:type')).toBe('product')
})

test('works with no provider (canonical falls back to page.url)', async () => {
	page.url = new URL('http://localhost/standalone')
	await render(Harness, { withProvider: false, config: { title: 'Solo' } })
	expect(document.title).toBe('Solo')
	expect(canonical()).toBe('http://localhost/standalone')
})
