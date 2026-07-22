<script lang="ts">
	import Root from '$lib/components/ui/product/product.svelte'
	import Price from '$lib/components/ui/product/product-price.svelte'
	import type { StoreProduct } from '@medusajs/types'
	let { product }: { product: StoreProduct } = $props()
</script>

<Root {product}><Price /></Root>
