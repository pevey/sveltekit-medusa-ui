<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import Discount from '$lib/components/ui/checkout/checkout-discount.svelte'
	import type { AddPromotionFn, RemovePromotionFn } from '$lib/components/ui/checkout/types.js'

	let { getCart, addPromotion, removePromotion }: { getCart?: any; addPromotion?: AddPromotionFn; removePromotion?: RemovePromotionFn } = $props()
</script>

<Root
	form={{ fields: {} } as any}
	{getCart}
	{addPromotion}
	{removePromotion}
>
	<Discount />
</Root>
