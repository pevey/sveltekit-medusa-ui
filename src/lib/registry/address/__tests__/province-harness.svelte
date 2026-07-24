<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import Province from '$lib/components/ui/address/address-province.svelte'
	let { form, getCart, getRegions, updateCart } = $props()
</script>
<Root {form} {getCart} {getRegions} {updateCart}><Province /></Root>
