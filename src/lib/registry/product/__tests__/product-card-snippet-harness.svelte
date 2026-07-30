<script lang="ts">
	import Card from '../product-card.svelte'
	import type { StoreProduct } from '@medusajs/types'

	let { product }: { product: StoreProduct } = $props()
</script>

<Card {product}>
	{#snippet children({ hasPriceRange })}
		<span data-custom>custom:{product.title}:{hasPriceRange}</span>
	{/snippet}
</Card>
