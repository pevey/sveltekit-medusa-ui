<script lang="ts">
	import CheckoutBraintree from '$lib/components/ui/checkout/checkout-braintree.svelte'
	import type { RemoteForm } from '@sveltejs/kit'

	let {
		form,
		googlePlacesApiKey
	}: {
		form: RemoteForm<any, any>
		googlePlacesApiKey?: string
	} = $props()
</script>

<CheckoutBraintree {form} {googlePlacesApiKey} navigate={() => {}} />
