<script lang="ts">
	import AddToCartToggle from '$lib/components/ui/cta/add-to-cart-toggle.svelte'
	import type { AddToCartFn, RemoveFromCartFn, GetCartFn, CartCondition } from '$lib/components/ui/cta/types.js'
	let { variantId, quantity, condition, addToCart, removeFromCart, getCart }:
		{ variantId?: string; quantity?: number; condition?: CartCondition; addToCart?: AddToCartFn; removeFromCart?: RemoveFromCartFn; getCart?: GetCartFn } = $props()
</script>

<svelte:boundary>
	<AddToCartToggle {variantId} {quantity} {condition} {addToCart} {removeFromCart} {getCart} />
	{#snippet pending()}<span data-testid="loading">loading</span>{/snippet}
</svelte:boundary>
