<script lang="ts">
	import Root from '$lib/components/ui/product/product.svelte'
	import Title from '$lib/components/ui/product/product-title.svelte'
	import Subtitle from '$lib/components/ui/product/product-subtitle.svelte'
	import type { StoreProduct } from '@medusajs/types'
	let { product }: { product: StoreProduct } = $props()
</script>

<Root {product}><Title /><Subtitle /></Root>
