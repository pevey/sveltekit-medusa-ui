<script lang="ts">
	import { createProductContext, setProductContext, type ProductContext } from '../ctx.svelte.js'
	import type { StoreProduct } from '@medusajs/types'

	let { product, selection = 'url', expose }: { product: StoreProduct | null; selection?: 'url' | 'local'; expose: (ctx: ProductContext) => void } = $props()

	// The factory is called once during init, exactly as a component would. `selection` is a
	// fixed mode and `expose` a one-shot handle, so reading both once is intended.
	// svelte-ignore state_referenced_locally
	const ctx = createProductContext({ product: () => product, selection })
	setProductContext(ctx)
	// svelte-ignore state_referenced_locally
	expose(ctx)
</script>

<span data-selected>{ctx.selectedVariantId}</span>
<span data-quantity>{ctx.quantity}</span>
<span data-navigable>{ctx.navigable}</span>
<span data-min>{ctx.priceMin?.calculated_amount ?? ''}</span>
<span data-max>{ctx.priceMax?.calculated_amount ?? ''}</span>
<span data-has-range>{ctx.hasPriceRange}</span>
