<script lang="ts">
	import Root from '$lib/components/ui/product/product.svelte'
	import JsonLd from '$lib/components/ui/product/product-jsonld.svelte'
	import type { StoreProduct } from '@medusajs/types'
	import type { Product, WithContext } from 'schema-dts'
	let { product, override, transform }:
		{ product: StoreProduct; override?: Partial<Product>; transform?: (s: WithContext<Product>) => WithContext<Product> } = $props()
</script>
<Root {product}><JsonLd {override} {transform} /></Root>
