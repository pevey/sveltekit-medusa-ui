<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import Items from '$lib/components/ui/cart/cart-items.svelte'
	import ItemSubtotal from '$lib/components/ui/cart/cart-item-subtotal.svelte'
	import type { GetCartFn } from '$lib/components/ui/cart/types.js'
	let { getCart }: { getCart?: GetCartFn } = $props()
</script>

<Root {getCart}>
	<Items><ItemSubtotal /></Items>
</Root>
