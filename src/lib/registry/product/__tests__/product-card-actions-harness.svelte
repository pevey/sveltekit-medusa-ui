<script lang="ts">
	import Card from '../product-card.svelte'
	import Probe from './product-card-action-probe.svelte'
	import type { StoreProduct } from '@medusajs/types'

	let { product }: { product: StoreProduct } = $props()
</script>

<Card {product}>
	{#snippet actions()}
		<Probe />
	{/snippet}
</Card>
