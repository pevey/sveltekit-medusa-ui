<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import Summary from '$lib/components/ui/product/product-reviews-summary.svelte'
	import Title from '$lib/components/ui/product/product-reviews-summary-title.svelte'
	import Count from '$lib/components/ui/product/product-reviews-summary-count.svelte'
	import Stars from '$lib/components/ui/product/product-reviews-summary-stars.svelte'
	import Histogram from '$lib/components/ui/product/product-reviews-histogram.svelte'
	import Bar from '$lib/components/ui/product/product-reviews-histogram-bar.svelte'
	import Label from '$lib/components/ui/product/product-reviews-histogram-label.svelte'
	import { getReviewsContext } from '$lib/components/ui/product/reviews-ctx.svelte.js'
	let { productId }: { productId: string } = $props()
</script>
<Root {productId} pageSize={10}>
	{#snippet children()}
		{@const ctx = getReviewsContext()}
		<!-- Reads ctx.reviews so the list query (and thus getReviews) actually evaluates —
		     Summary/Histogram intentionally only read ctx.summary/ctx.count. -->
		<span data-reviews-count hidden>{ctx.reviews.length}</span>
		<Summary>
			<Title>Customer Reviews</Title>
			<Stars />
			<Count />
			<Histogram>
				<Bar><Label /></Bar>
			</Histogram>
		</Summary>
	{/snippet}
</Root>
