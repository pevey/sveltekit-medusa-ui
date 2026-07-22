<script lang="ts">
	import Root from '$lib/components/ui/search/search.svelte'
	import Input from '$lib/components/ui/search/search-input.svelte'
	import Results from '$lib/components/ui/search/search-results.svelte'
	import Seed from './results-seed.svelte'
	import type { SearchHit } from '$lib/components/ui/search/ctx.svelte.js'

	let { hits = [] }: { hits?: SearchHit[] } = $props()
</script>

<Root search={async () => ({ hits })}>
	{#snippet children()}
		<Seed {hits} />
		<Input />
		<Results />
	{/snippet}
</Root>
