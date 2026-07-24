<script lang="ts">
	import CheckoutBraintree from '$lib/components/ui/checkout/checkout-braintree.svelte'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { GetCartFn, CompleteCartFn } from '$lib/components/ui/checkout/types.js'

	let {
		form,
		googlePlacesApiKey,
		getCart,
		completeCart
	}: {
		form: RemoteForm<any, any>
		googlePlacesApiKey?: string
		getCart?: GetCartFn
		completeCart?: CompleteCartFn
	} = $props()
</script>

<CheckoutBraintree {form} {googlePlacesApiKey} {getCart} {completeCart} navigate={() => {}} />
