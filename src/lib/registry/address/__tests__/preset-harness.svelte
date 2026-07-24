<script lang="ts">
	import { AddressForm } from '$lib/components/ui/address/index.js'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { GetCartFn, GetRegionsFn, UpdateCartFn } from '$lib/components/ui/address/types.js'
	let {
		form,
		googlePlacesApiKey,
		getCart,
		getRegions,
		updateCart
	}: {
		form: RemoteForm<any, any>
		googlePlacesApiKey?: string
		getCart?: GetCartFn
		getRegions?: GetRegionsFn
		updateCart?: UpdateCartFn
	} = $props()
</script>
<AddressForm {form} {googlePlacesApiKey} {getCart} {getRegions} {updateCart} />
