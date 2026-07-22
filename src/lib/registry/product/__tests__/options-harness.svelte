<script lang="ts">
	import Root from '$lib/components/ui/product/product.svelte'
	import Options from '$lib/components/ui/product/product-options.svelte'
	import OptionButton from '$lib/components/ui/product/product-option-button.svelte'
	import type { StoreProduct } from '@medusajs/types'
	let { product }: { product: StoreProduct } = $props()
</script>

<Root {product}>
	<Options>
		{#each product.options ?? [] as option (option.id)}
			<OptionButton {option} />
		{/each}
	</Options>
</Root>
