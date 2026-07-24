<script lang="ts">
	import { AddressForm } from '$lib/components/ui/address/index.js'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { GetCartFn, GetRegionsFn, UpdateCartFn } from '$lib/components/ui/address/types.js'
	let {
		form,
		apiKey,
		getCart,
		getRegions,
		updateCart
	}: {
		form: RemoteForm<any, any>
		apiKey?: string
		getCart?: GetCartFn
		getRegions?: GetRegionsFn
		updateCart?: UpdateCartFn
	} = $props()
</script>
<AddressForm {form} {apiKey} {getCart} {getRegions} {updateCart} />
