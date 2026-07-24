<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import Delivery from '$lib/components/ui/checkout/checkout-delivery.svelte'
	import Probe from './delivery-refresh-probe.svelte'
	import type { GetShippingOptionsFn, SelectShippingOptionFn } from '$lib/components/ui/checkout/types.js'

	let { getCart, getShippingOptions, selectShippingOption, cart }: { getCart?: any; getShippingOptions?: GetShippingOptionsFn; selectShippingOption?: SelectShippingOptionFn; cart?: any } = $props()
</script>

<Root
	form={{ fields: {} } as any}
	{getCart}
	{selectShippingOption}
>
	<Delivery {getShippingOptions} />
	<Probe {cart} />
</Root>
