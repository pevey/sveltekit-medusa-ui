<script lang="ts">
	import Root from '$lib/components/ui/search/search.svelte'
	import { getSearchContext } from '$lib/components/ui/search/ctx.svelte.js'

	// `query` stays undefined unless a test passes it, so the seeding attachment is absent
	// by default and the pre-existing open/close tests are unaffected.
	let { query }: { query?: string } = $props()
</script>

<Root {query}>
	{#snippet children()}
		{@const state = getSearchContext()}
		<button data-testid="open" onclick={() => (state.open = true)}>open</button>
		<span data-testid="state">{state.open ? 'open' : 'closed'}</span>
		<span data-testid="query">{state.query}</span>
		<span data-testid="hits">{state.hits.length}</span>
	{/snippet}
</Root>
<div data-testid="outside">outside</div>
