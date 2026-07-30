<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import Badge from '$lib/components/ui/cart/cart-badge.svelte'
	let { mode }: { mode?: 'total' | 'lines' } = $props()
</script>

<Root><Badge {mode} /></Root>
