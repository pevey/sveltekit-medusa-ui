<script lang="ts">
	import * as Collections from '../index.js'
	import type { StoreCollection } from '@medusajs/types'

	let { collections, pageSize = 24 }: { collections?: StoreCollection[]; pageSize?: number } = $props()
</script>

<Collections.Root {collections} {pageSize}>
	{#snippet children({ count, pageCount })}
		<span data-count>{count}</span>
		<span data-page-count>{pageCount}</span>
		<Collections.Grid>
			{#snippet empty()}<span data-empty>No collections</span>{/snippet}
		</Collections.Grid>
		<Collections.Pagination />
	{/snippet}
</Collections.Root>
