<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import AddressLine1 from '$lib/components/ui/address/address-line1.svelte'
	let { form } = $props()
</script>
<Root {form}><AddressLine1 /></Root>
