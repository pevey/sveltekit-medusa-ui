<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import PlaceOrder from '$lib/components/ui/checkout/checkout-place-order.svelte'
	import CheckoutError from '$lib/components/ui/checkout/checkout-error.svelte'
	import Confirmation from '$lib/components/ui/checkout/checkout-confirmation.svelte'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { GetCartFn, CompleteCartFn } from '$lib/components/ui/checkout/types.js'

	let {
		form,
		getCart,
		completeCart
	}: {
		form: RemoteForm<any, any>
		getCart?: GetCartFn
		completeCart?: CompleteCartFn
	} = $props()
</script>

<Root {form} {getCart} {completeCart} navigate={() => {}}>
	<PlaceOrder />
	<CheckoutError />
	<Confirmation />
</Root>
