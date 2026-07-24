<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import FirstName from '$lib/components/ui/address/address-first-name.svelte'
	import LastName from '$lib/components/ui/address/address-last-name.svelte'
	import Email from '$lib/components/ui/address/address-email.svelte'
	import Phone from '$lib/components/ui/address/address-phone.svelte'
	import Line2 from '$lib/components/ui/address/address-line2.svelte'
	import City from '$lib/components/ui/address/address-city.svelte'
	import Country from '$lib/components/ui/address/address-country.svelte'
	import PostalCode from '$lib/components/ui/address/address-postal-code.svelte'
	let { form, getCart, getRegions, updateCart } = $props()
</script>

<Root {form} {getCart} {getRegions} {updateCart}>
	<Email /><FirstName /><LastName /><Phone /><Line2 /><City /><Country /><PostalCode />
</Root>
