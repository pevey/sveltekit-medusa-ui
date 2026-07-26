<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import Items from '$lib/components/ui/cart/cart-items.svelte'
	import Quantity from '$lib/components/ui/cart/cart-quantity.svelte'
	import Remove from '$lib/components/ui/cart/cart-remove.svelte'
</script>
<Root>
	<Items>
		<Quantity /><Remove />
	</Items>
</Root>
