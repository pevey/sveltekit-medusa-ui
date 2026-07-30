<script lang="ts">
	import * as Categories from '../index.js'
	import type { StoreProductCategory } from '@medusajs/types'

	let { categories, parentId, pageSize = 24 }: { categories?: StoreProductCategory[]; parentId?: string; pageSize?: number } = $props()
</script>

<Categories.Root {categories} {parentId} {pageSize}>
	{#snippet children({ count, pageCount })}
		<span data-count>{count}</span>
		<span data-page-count>{pageCount}</span>
		<Categories.Grid>
			{#snippet empty()}<span data-empty>No categories</span>{/snippet}
		</Categories.Grid>
		<Categories.Pagination />
	{/snippet}
</Categories.Root>
