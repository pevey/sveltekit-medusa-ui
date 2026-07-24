<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import { getCheckoutContext } from '$lib/components/ui/checkout/ctx.svelte.js'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { StoreOrder } from '@medusajs/types'
	import type { GetCartFn, CompleteCartFn, SelectShippingOptionFn } from '$lib/components/ui/checkout/types.js'
	let {
		form,
		getCart,
		completeCart,
		selectShippingOption,
		navigate,
		redirectTo,
		oncomplete
	}: {
		form: RemoteForm<any, any>
		getCart?: GetCartFn
		completeCart?: CompleteCartFn
		selectShippingOption?: SelectShippingOptionFn
		navigate?: (url: string) => void | Promise<void>
		redirectTo?: string | ((order: StoreOrder) => string)
		oncomplete?: (order: StoreOrder) => void
	} = $props()
</script>
<Root {form} {getCart} {completeCart} {selectShippingOption} {navigate} {redirectTo} {oncomplete}>
	{@const ctx = getCheckoutContext()}
	<span data-testid="placing">{ctx.placing}</span>
	<span data-testid="order">{ctx.order?.id ?? 'none'}</span>
	<button data-testid="reg-addr" onclick={() => ctx.registerAddress(async () => ({ id: 'c' }) as any)}>reg-addr</button>
	<button data-testid="reg-pay" onclick={() => ctx.registerPayment(async () => ({ ok: true }))}>reg-pay</button>
	<button data-testid="place" onclick={() => ctx.placeOrder()}>place</button>
</Root>
