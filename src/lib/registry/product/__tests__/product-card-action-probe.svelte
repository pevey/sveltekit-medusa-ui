<script lang="ts">
	import { getProductContextOptional } from '../ctx.svelte.js'

	// Stands in for <AddToCartButton />: reads the ambient product context with no props, which
	// is what makes `actions` inside a card work without wiring a variant id through.
	const ctx = getProductContextOptional()
</script>

<span data-action data-variant={ctx?.selectedVariantId ?? ''}>buy</span>
