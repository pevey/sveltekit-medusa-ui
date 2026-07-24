<script lang="ts">
	// Test probe: sits inside <Checkout.Root>, reads the address-owned host seam Root filled, and
	// fires an address-change so we can assert Delivery re-fetches shipping options — the same signal
	// the real AddressForm emits when the shopper sets their address/region.
	import { getAddressHostOptional } from '$lib/components/ui/address/ctx.svelte.js'

	const host = getAddressHostOptional()
	let { cart }: { cart?: any } = $props()
</script>

<button data-testid="addr-change" onclick={() => host?.onAddressChange?.(cart)}>change</button>
