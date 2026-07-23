import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'
import JsonLd from '$lib/components/ui/seo/json-ld.svelte'

function ldScript() {
	return [...document.head.querySelectorAll('script[type="application/ld+json"]')].pop() as HTMLScriptElement | undefined
}

test('injects a JSON-LD script with @context and the schema', async () => {
	await render(JsonLd, { schema: { '@type': 'Product', name: 'Tee' } as any })
	const el = ldScript()
	expect(el).toBeTruthy()
	const data = JSON.parse(el!.textContent!)
	expect(data['@context']).toBe('https://schema.org')
	expect(data['@type']).toBe('Product')
	expect(data.name).toBe('Tee')
})

test('array input → single node with @context and a @graph of all nodes', async () => {
	await render(JsonLd, { schema: [{ '@type': 'Product', name: 'A' }, { '@type': 'Organization', name: 'B' }] as any })
	const el = ldScript()
	const data = JSON.parse(el!.textContent!)
	expect(data['@context']).toBe('https://schema.org')
	expect(Array.isArray(data['@graph'])).toBe(true)
	expect(data['@graph'].length).toBe(2)
	expect(data['@graph'][0].name).toBe('A')
	expect(data['@graph'][1].name).toBe('B')
})

test('escapes "<" to prevent script-tag breakout (XSS)', async () => {
	await render(JsonLd, { schema: { '@type': 'Product', name: '</script><script>alert(1)' } as any })
	const el = ldScript()
	// Raw text must not contain a literal "<" from the payload — it is unicode-escaped.
	expect(el!.textContent).not.toContain('</script><script>')
	expect(el!.textContent).toContain('\\u003c')
	// …but it still parses back to the original string.
	expect(JSON.parse(el!.textContent!).name).toBe('</script><script>alert(1)')
})
