<script lang="ts">
	import Root from '$lib/components/ui/checkout/checkout.svelte'
	import AutoSwitch from '$lib/components/ui/checkout/checkout-auto-switch.svelte'
	import type { RemoteForm } from '@sveltejs/kit'

	let {
		form,
		getCart,
		config
	}: { form: RemoteForm<any, any>; getCart?: any; config?: any } = $props()
</script>

<Root {form} {getCart} navigate={() => {}}>
	<AutoSwitch {form} {config} publishableKey="pk_test_x" returnUrl="/checkout/return" />
</Root>
