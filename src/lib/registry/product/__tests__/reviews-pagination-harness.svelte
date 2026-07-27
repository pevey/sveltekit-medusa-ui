<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import Pagination from '$lib/components/ui/product/product-reviews-pagination.svelte'
	import PaginationPrev from '$lib/components/ui/product/product-reviews-pagination-prev.svelte'
	import PaginationInfo from '$lib/components/ui/product/product-reviews-pagination-info.svelte'
	import PaginationNext from '$lib/components/ui/product/product-reviews-pagination-next.svelte'
	import { getReviewsContext } from '$lib/components/ui/product/reviews-ctx.svelte.js'
	let { productId }: { productId: string } = $props()
</script>
<Root {productId} pageSize={10}>
	{#snippet children()}
		{@const ctx = getReviewsContext()}
		<!-- Reads ctx.reviews so the list query (and thus getReviews) actually evaluates -->
		<span data-reviews-count hidden>{ctx.reviews.length}</span>
		<Pagination>
			{#snippet children()}
				<PaginationPrev />
				<PaginationInfo />
				<PaginationNext />
			{/snippet}
		</Pagination>
	{/snippet}
</Root>
