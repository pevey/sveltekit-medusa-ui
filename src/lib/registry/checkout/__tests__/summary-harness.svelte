<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import Summary from '$lib/components/ui/checkout/checkout-summary.svelte'
	import Subtotal from '$lib/components/ui/checkout/checkout-summary-subtotal.svelte'
	import Tax from '$lib/components/ui/checkout/checkout-summary-tax.svelte'
	import Shipping from '$lib/components/ui/checkout/checkout-summary-shipping.svelte'
	import Total from '$lib/components/ui/checkout/checkout-summary-total.svelte'
	import GiftCard from '$lib/components/ui/checkout/checkout-summary-gift-card.svelte'

	let { getCart }: { getCart?: any } = $props()
</script>

<Root form={{ fields: {} } as any} {getCart}>
	<Summary>
		<Subtotal />
		<Tax />
		<Shipping />
		<Total />
		<GiftCard />
	</Summary>
</Root>
