<script lang="ts">
	import Root from '$lib/components/ui/search/search.svelte'
	import Input from '$lib/components/ui/search/search-input.svelte'
	import type { SearchFn } from '$lib/components/ui/search/ctx.svelte.js'
	let { search }: { search: SearchFn } = $props()
</script>

<Root {search} minLength={2} debounce={10}>
	{#snippet children()}
		<Input placeholder="Search" />
	{/snippet}
</Root>
