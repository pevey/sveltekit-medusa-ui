<script lang="ts">
	import AddToCartToggle from '$lib/components/ui/cta/add-to-cart-toggle.svelte'
	import type { CartCondition } from '$lib/components/ui/cta/types.js'
	let { variantId, quantity, condition, onadd, onremove }: {
		variantId?: string
		quantity?: number
		condition?: CartCondition
		onadd?: (c: unknown) => void
		onremove?: (c: unknown) => void
	} = $props()
</script>

<svelte:boundary>
	<AddToCartToggle {variantId} {quantity} {condition} {onadd} {onremove} />
	{#snippet pending()}<span data-testid="loading">loading</span>{/snippet}
</svelte:boundary>
