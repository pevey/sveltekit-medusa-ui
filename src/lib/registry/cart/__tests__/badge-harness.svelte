<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import Badge from '$lib/components/ui/cart/cart-badge.svelte'
	import type { GetCartFn } from '$lib/components/ui/cart/types.js'
	let { getCart, mode }: { getCart?: GetCartFn; mode?: 'total' | 'lines' } = $props()
</script>
<Root {getCart}><Badge {mode} /></Root>
