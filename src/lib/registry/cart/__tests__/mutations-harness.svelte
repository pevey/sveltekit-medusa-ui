<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import Items from '$lib/components/ui/cart/cart-items.svelte'
	import Quantity from '$lib/components/ui/cart/cart-quantity.svelte'
	import Remove from '$lib/components/ui/cart/cart-remove.svelte'
	import type { GetCartFn, UpdateCartItemFn, RemoveFromCartFn } from '$lib/components/ui/cart/types.js'
	let { getCart, updateCartItem, removeFromCart }:
		{ getCart?: GetCartFn; updateCartItem?: UpdateCartItemFn; removeFromCart?: RemoveFromCartFn } = $props()
</script>
<Root {getCart} {updateCartItem} {removeFromCart}>
	<Items>
		<Quantity /><Remove />
	</Items>
</Root>
