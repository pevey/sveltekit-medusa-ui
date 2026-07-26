<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import Province from '$lib/components/ui/address/address-province.svelte'
	let { form } = $props()
</script>
<Root {form}><Province /></Root>
