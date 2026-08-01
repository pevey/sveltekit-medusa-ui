<script lang="ts">
	// The hybrid escape hatch: skip the parts entirely and lay the cart out yourself from the
	// snippet argument.
	import Root from '$lib/components/ui/cart/cart.svelte'
</script>

<Root>
	{#snippet children({ cart, items, count, lineCount, subtotal, loading, pending })}
		<span data-testid="id">{cart?.id ?? 'none'}</span>
		<span data-testid="items">{items.length}</span>
		<span data-testid="count">{count}</span>
		<span data-testid="lines">{lineCount}</span>
		<span data-testid="subtotal">{subtotal ?? 'none'}</span>
		<span data-testid="loading">{loading}</span>
		<span data-testid="pending">{pending}</span>
	{/snippet}
</Root>
