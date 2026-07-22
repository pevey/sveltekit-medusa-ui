<script lang="ts">
	import Icon from '$lib/components/ui/search/search-icon.svelte'
	let { custom = false }: { custom?: boolean } = $props()
</script>

{#if custom}
	<Icon>
		<span data-testid="custom-icon">X</span>
	</Icon>
{:else}
	<Icon />
{/if}
