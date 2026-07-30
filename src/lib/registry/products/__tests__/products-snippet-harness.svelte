<script lang="ts">
	import * as Products from '../index.js'
	import type { StoreProduct } from '@medusajs/types'

	let { products }: { products: StoreProduct[] } = $props()
</script>

<Products.Root {products}>
	{#snippet children()}
		<Products.Grid>
			{#snippet children({ product })}
				<span data-row>{product.title}</span>
			{/snippet}
		</Products.Grid>
	{/snippet}
</Products.Root>
