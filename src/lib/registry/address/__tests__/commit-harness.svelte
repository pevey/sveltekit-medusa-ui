<script lang="ts">
	import Root from '$lib/components/ui/address/address-root.svelte'
	import { getAddressContext } from '$lib/components/ui/address/ctx.svelte.js'
	import type { RemoteForm } from '@sveltejs/kit'
	import type { GetCartFn, GetRegionsFn, UpdateCartFn, AddressCommit } from '$lib/components/ui/address/types.js'
	let {
		form,
		getCart,
		getRegions,
		updateCart,
		registerCommit
	}: {
		form: RemoteForm<any, any>
		getCart?: GetCartFn
		getRegions?: GetRegionsFn
		updateCart?: UpdateCartFn
		registerCommit?: (commit: AddressCommit) => void
	} = $props()
</script>

<Root {form} {getCart} {getRegions} {updateCart} {registerCommit}>
	{@const ctx = getAddressContext()}
	<span data-testid="expanded">{ctx.expanded}</span>
	<button data-testid="expand" onclick={() => ctx.setExpanded(true)}>expand</button>
	<button data-testid="commit" onclick={() => ctx.commit()}>commit</button>
	<!-- live inputs so reconcileFromDom has something to read -->
	<input name="country_code" value="United States" />
	<input name="province" value="Louisiana" />
	<input name="city" value="Shreveport" />
</Root>
