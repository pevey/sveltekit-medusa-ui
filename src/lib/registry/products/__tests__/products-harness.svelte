<script lang="ts">
	import * as Products from '../index.js'
	import type { StoreProduct } from '@medusajs/types'

	let {
		products,
		categoryId,
		pageSize = 12,
		href
	}: { products?: StoreProduct[]; categoryId?: string; pageSize?: number; href?: (p: StoreProduct) => string } = $props()
</script>

<Products.Root {products} {categoryId} {pageSize} {href}>
	{#snippet children({ count, pageCount })}
		<span data-count>{count}</span>
		<span data-page-count>{pageCount}</span>
		<Products.Grid>
			{#snippet empty()}<span data-empty>Nothing here</span>{/snippet}
		</Products.Grid>
		<Products.Pagination />
	{/snippet}
</Products.Root>
