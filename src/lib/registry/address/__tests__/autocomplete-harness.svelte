<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import Autocomplete from '$lib/components/ui/address/address-autocomplete.svelte'
	let { form, apiKey, getCart, getRegions, updateCart } = $props()
</script>
<Root {form} {apiKey} {getCart} {getRegions} {updateCart}><Autocomplete /></Root>
