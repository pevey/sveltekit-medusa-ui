<script lang="ts">
	import { AddressFormCollapsed } from '$lib/components/ui/address/index.js'
	let { form, apiKey = undefined, getCart, getRegions, updateCart } = $props()
</script>
<AddressFormCollapsed {form} {apiKey} {getCart} {getRegions} {updateCart} />
