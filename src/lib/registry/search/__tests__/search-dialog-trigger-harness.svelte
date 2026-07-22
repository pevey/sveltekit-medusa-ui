<script lang="ts">
	import SearchDialog from '$lib/components/ui/search/search-dialog.svelte'
	import type { SearchFn } from '$lib/components/ui/search/ctx.svelte.js'

	let { search }: { search: SearchFn } = $props()
</script>

<SearchDialog {search}>
	{#snippet trigger(open)}
		<button data-testid="open-btn" onclick={open}>Search</button>
	{/snippet}
</SearchDialog>
