<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import Items from '$lib/components/ui/cart/cart-items.svelte'
	import Title from '$lib/components/ui/cart/cart-title.svelte'
	import Price from '$lib/components/ui/cart/cart-price.svelte'
</script>

<Root>
	<Items>
		<Title /><Price />
	</Items>
</Root>
