<script lang="ts">
	import SearchDialog from '$lib/components/ui/search/search-dialog.svelte'
</script>

<SearchDialog>
	{#snippet trigger(open)}
		<button data-testid="open-btn" onclick={open}>Search</button>
	{/snippet}
</SearchDialog>
