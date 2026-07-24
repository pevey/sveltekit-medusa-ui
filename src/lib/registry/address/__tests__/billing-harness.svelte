<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import BillingToggle from '$lib/components/ui/address/address-billing-toggle.svelte'
	import Billing from '$lib/components/ui/address/address-billing.svelte'
	let { form, getCart, getRegions, updateCart } = $props()
</script>
<Root {form} {getCart} {getRegions} {updateCart}>
	<BillingToggle /><Billing />
</Root>
