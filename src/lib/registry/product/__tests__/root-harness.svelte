<script lang="ts">
	import Root from '$lib/components/ui/product/product.svelte'
	import { getProductContext } from '$lib/components/ui/product/ctx.svelte.js'
	import type { StoreProduct } from '@medusajs/types'
	let { product }: { product: StoreProduct } = $props()
</script>

<Root {product}>
	{@const ctx = getProductContext()}
	<span data-testid="selected">{ctx.selectedVariant?.id ?? 'none'}</span>
	<span data-testid="qty">{ctx.quantity}</span>
	<a data-testid="href" href={ctx.buildHref('v_bm')}>go</a>
	<a data-testid="qtyhref" href={ctx.buildQuantityHref(3)}>qty3</a>
</Root>
