<script lang="ts">
	import Root from '$lib/components/ui/search/search.svelte'
	import Hit from '$lib/components/ui/search/search-hit.svelte'
	import type { SearchHit } from '$lib/components/ui/search/ctx.svelte.js'

	let {
		hit,
		href
	}: { hit: SearchHit; href?: (h: SearchHit) => string } = $props()
</script>

<Root search={async () => ({ hits: [] })}>
	{#snippet children()}
		<Hit {hit} {href} />
	{/snippet}
</Root>
