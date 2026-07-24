<script lang="ts">
	import { AddressFormCollapsed } from '$lib/components/ui/address/index.js'
	let { form, googlePlacesApiKey = undefined, getCart, getRegions, updateCart } = $props()
</script>
<AddressFormCollapsed {form} {googlePlacesApiKey} {getCart} {getRegions} {updateCart} />
