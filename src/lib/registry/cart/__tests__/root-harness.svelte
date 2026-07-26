<script lang="ts">
	import Root from '$lib/components/ui/cart/cart.svelte'
	import { getCartContext } from '$lib/components/ui/cart/ctx.svelte.js'
	let { onupdate, onremove, onerror }: { onupdate?: any; onremove?: any; onerror?: any } = $props()
</script>

<Root {onupdate} {onremove} {onerror}>
	{@const ctx = getCartContext()}
	<span data-testid="count">{ctx.count}</span>
	<span data-testid="lines">{ctx.lineCount}</span>
	<span data-testid="subtotal">{ctx.subtotal ?? 'none'}</span>
	<span data-testid="pending">{ctx.pending}</span>
	<button data-testid="do-update" onclick={() => ctx.updateItem('li1', 4)}>update</button>
	<button data-testid="do-remove" onclick={() => ctx.removeItem('li1')}>remove</button>
</Root>
