<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import Sort from '$lib/components/ui/product/product-reviews-sort.svelte'
	import { getReviewsContext } from '$lib/components/ui/product/reviews-ctx.svelte.js'
	let { productId }: { productId: string } = $props()
</script>
<Root {productId} pageSize={10}>
	{#snippet children()}
		{@const ctx = getReviewsContext()}
		<!-- Reads ctx.reviews so the list query (and thus getReviews) actually evaluates -->
		<span data-reviews-count hidden>{ctx.reviews.length}</span>
		<Sort />
	{/snippet}
</Root>
