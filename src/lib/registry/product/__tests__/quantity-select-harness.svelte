<script lang="ts">
	import Root from '$lib/components/ui/product/product.svelte'
	import QuantitySelect from '$lib/components/ui/product/product-quantity-select.svelte'
	import type { StoreProduct } from '@medusajs/types'
	let { product, navigate, standalone = false }:
		{ product?: StoreProduct; navigate?: (href: string) => void; standalone?: boolean } = $props()
</script>

{#if standalone}
	<QuantitySelect maxQuantity={5} />
{:else}
	<Root {product}>
		<QuantitySelect maxQuantity={5} {navigate} />
	</Root>
{/if}
