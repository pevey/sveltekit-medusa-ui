<script lang="ts">
	import Root from '$lib/components/ui/product/product.svelte'
	import Description from '$lib/components/ui/product/product-description.svelte'
	import type { StoreProduct } from '@medusajs/types'
	let { product }: { product: StoreProduct } = $props()
</script>

<Root {product}><Description /></Root>
