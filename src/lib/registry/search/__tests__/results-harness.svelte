<script lang="ts">
	import Root from '$lib/components/ui/search/search.svelte'
	import Results from '$lib/components/ui/search/search-results.svelte'
	import type { SearchHit } from '$lib/components/ui/search/ctx.svelte.js'
	import Seed from './results-seed.svelte'

	let {
		hits = [],
		isStatic = false,
		useSnippet = false
	}: { hits?: SearchHit[]; isStatic?: boolean; useSnippet?: boolean } = $props()
</script>

<Root search={async () => ({ hits })}>
	{#snippet children()}
		<Seed {hits} />
		{#if useSnippet}
			<Results static={isStatic}>
				{#snippet hit(h)}
					<a data-testid="custom-hit" href={`/custom/${h.slug}`}>{h.title}</a>
				{/snippet}
			</Results>
		{:else}
			<Results static={isStatic} />
		{/if}
	{/snippet}
</Root>
