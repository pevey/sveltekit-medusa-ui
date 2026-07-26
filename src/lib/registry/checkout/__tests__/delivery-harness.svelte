<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import Delivery from '$lib/components/ui/checkout/checkout-delivery.svelte'
	import Probe from './delivery-refresh-probe.svelte'

	let { cart }: { cart?: any } = $props()
</script>

<Root form={{ fields: {} } as any}>
	<Delivery />
	<Probe {cart} />
</Root>
