<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import { getAddressContext } from '$lib/components/ui/address/ctx.svelte.js'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { StoreCart } from '@medusajs/types'
	import type { GetCartFn, GetRegionsFn, UpdateCartFn } from '$lib/components/ui/address/types.js'
	let {
		form,
		googlePlacesApiKey,
		getCart,
		getRegions,
		updateCart,
		onregionchange,
		onaddresschange,
		onerror
	}: {
		form: RemoteForm<any, any>
		googlePlacesApiKey?: string
		getCart?: GetCartFn
		getRegions?: GetRegionsFn
		updateCart?: UpdateCartFn
		onregionchange?: (regionId: string, country: string) => void
		onaddresschange?: (cart: StoreCart) => void
		onerror?: (err: unknown) => void
	} = $props()
</script>

<Root {form} {googlePlacesApiKey} {getCart} {getRegions} {updateCart} {onregionchange} {onaddresschange} {onerror}>
	{@const ctx = getAddressContext()}
	<span data-testid="countries">{ctx.countries.map((c) => c.code).join(',')}</span>
	<span data-testid="isAutocomplete">{ctx.isAutocomplete}</span>
	<span data-testid="showBilling">{ctx.showBilling}</span>
	<button data-testid="region-ca" onclick={() => ctx.setRegionForCountry('ca')}>region</button>
	<button data-testid="save" onclick={() => ctx.save()}>save</button>
	<button data-testid="billing-off" onclick={() => ctx.setBillingSameAsShipping(true)}>same</button>
	<button
		data-testid="autocomplete"
		onclick={() =>
			ctx.setAddressFromAutocomplete(
				{ address_1: '1 Main St', address_2: '', city: 'LA', province: 'California', postal_code: '90001', country_code: 'us' },
				''
			)}
	>autocomplete</button>
</Root>
