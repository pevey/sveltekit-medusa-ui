<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import Items from '$lib/components/ui/checkout/checkout-items.svelte'
	import Item from '$lib/components/ui/checkout/checkout-item.svelte'
	import Title from '$lib/components/ui/checkout/checkout-title.svelte'
	import Price from '$lib/components/ui/checkout/checkout-price.svelte'
	import ItemSubtotal from '$lib/components/ui/checkout/checkout-item-subtotal.svelte'
	let { form, getCart } = $props()
</script>

<Root {form} {getCart}>
	<Items>
		{#snippet children()}<Title /><Price /><ItemSubtotal />{/snippet}
	</Items>
</Root>
