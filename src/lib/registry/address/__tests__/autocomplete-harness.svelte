<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import Autocomplete from '$lib/components/ui/address/address-autocomplete.svelte'
	let { form, googlePlacesApiKey, getCart, getRegions, updateCart } = $props()
</script>
<Root {form} {googlePlacesApiKey} {getCart} {getRegions} {updateCart}><Autocomplete /></Root>
