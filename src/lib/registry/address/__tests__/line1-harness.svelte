<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import AddressLine1 from '$lib/components/ui/address/address-line1.svelte'
	let { form, getCart, getRegions, updateCart } = $props()
</script>
<Root {form} {getCart} {getRegions} {updateCart}><AddressLine1 /></Root>
