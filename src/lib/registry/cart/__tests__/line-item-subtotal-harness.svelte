<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import Items from '$lib/components/ui/cart/cart-items.svelte'
	import LineItemSubtotal from '$lib/components/ui/cart/cart-line-item-subtotal.svelte'
	import type { GetCartFn } from '$lib/components/ui/cart/types.js'
	let { getCart }: { getCart?: GetCartFn } = $props()
</script>

<Root {getCart}>
	<Items><LineItemSubtotal /></Items>
</Root>
