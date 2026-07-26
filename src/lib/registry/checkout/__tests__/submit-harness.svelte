<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import PlaceOrder from '$lib/components/ui/checkout/checkout-place-order.svelte'
	import CheckoutError from '$lib/components/ui/checkout/checkout-error.svelte'
	import Confirmation from '$lib/components/ui/checkout/checkout-confirmation.svelte'
	import type { RemoteForm } from '@sveltejs/kit'

	let {
		form
	}: {
		form: RemoteForm<any, any>
	} = $props()
</script>

<Root {form} navigate={() => {}}>
	<PlaceOrder />
	<CheckoutError />
	<Confirmation />
</Root>
