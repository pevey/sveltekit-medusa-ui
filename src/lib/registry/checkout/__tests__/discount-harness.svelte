<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import Discount from '$lib/components/ui/checkout/checkout-discount.svelte'
</script>

<Root form={{ fields: {} } as any}>
	<Discount />
</Root>
