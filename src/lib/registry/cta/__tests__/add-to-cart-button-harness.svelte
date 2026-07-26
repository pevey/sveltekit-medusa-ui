<script lang="ts">
	import AddToCartButton from '$lib/components/ui/cta/add-to-cart-button.svelte'
	let { variantId, quantity, navigate, disabled, redirectTo }:
		{ variantId?: string; quantity?: number; navigate?: (h: string) => void; disabled?: boolean; redirectTo?: string } = $props()
</script>

<AddToCartButton {variantId} {quantity} {navigate} {disabled} {redirectTo} />
