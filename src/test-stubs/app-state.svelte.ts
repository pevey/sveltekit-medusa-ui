// Stub for `$app/state` in this package's own vitest/svelte-check (there is no
// SvelteKit app to provide it). `page.url` is a reactive SvelteURL; tests mutate
// it (e.g. `page.url.search = '?v=…'`) and components reading `page.url.searchParams`
// re-derive. In a real consuming app, the SvelteKit-provided `$app/state` is used.
import { SvelteURL } from 'svelte/reactivity'

export const page = {
	url: new SvelteURL('http://localhost/')
}
