<script lang="ts">
	import Root from '$lib/components/ui/search/search.svelte'
	import { getSearchContext } from '$lib/components/ui/search/ctx.svelte.js'
</script>

<Root>
	{#snippet children()}
		{@const state = getSearchContext()}
		<button data-testid="open" onclick={() => (state.open = true)}>open</button>
		<span data-testid="state">{state.open ? 'open' : 'closed'}</span>
	{/snippet}
</Root>
<div data-testid="outside">outside</div>
