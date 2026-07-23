<script lang="ts">
	import AddToCartButton from '$lib/components/ui/cta/add-to-cart-button.svelte'
	import type { AddToCartFn } from '$lib/components/ui/cta/types.js'
	let { variantId, quantity, addToCart, navigate, disabled, redirectTo }:
		{ variantId?: string; quantity?: number; addToCart?: AddToCartFn; navigate?: (h: string) => void; disabled?: boolean; redirectTo?: string } = $props()
</script>

<AddToCartButton {variantId} {quantity} {addToCart} {navigate} {disabled} {redirectTo} />
