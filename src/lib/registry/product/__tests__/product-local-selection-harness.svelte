<script lang="ts">
	import { createProductContext, setProductContext } from '../ctx.svelte.js'
	import OptionButton from '../product-option-button.svelte'
	import QuantitySelect from '../product-quantity-select.svelte'
	import type { StoreProduct } from '@medusajs/types'

	let { product, selection = 'local' }: { product: StoreProduct; selection?: 'url' | 'local' } = $props()

	// svelte-ignore state_referenced_locally
	const ctx = createProductContext({ product: () => product, selection })
	setProductContext(ctx)
</script>

<OptionButton option={product.options![0]} />
<QuantitySelect />
<span data-selected>{ctx.selectedVariantId}</span>
<span data-quantity>{ctx.quantity}</span>
