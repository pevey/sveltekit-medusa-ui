<script lang="ts">
	import Root from '$lib/components/ui/search/search.svelte'
	import Input from '$lib/components/ui/search/search-input.svelte'
</script>

<Root minLength={2} debounce={10}>
	{#snippet children()}
		<Input placeholder="Search" />
	{/snippet}
</Root>
