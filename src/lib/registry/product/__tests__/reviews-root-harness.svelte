<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import { getReviewsContext } from '$lib/components/ui/product/reviews-ctx.svelte.js'
	let { productId, pageSize }: { productId: string; pageSize?: number } = $props()
</script>
<Root {productId} {pageSize}>
	{#snippet children()}
		{@const ctx = getReviewsContext()}
		<span data-count>{ctx.count}</span>
		<span data-page>{ctx.page}</span>
		<span data-order>{ctx.order}</span>
		<span data-rating>{ctx.rating ?? 'null'}</span>
		<span data-reviews>{ctx.reviews.length}</span>
		<button data-set-rating onclick={() => ctx.setRating(5)}>r5</button>
		<button data-clear-rating onclick={() => ctx.setRating(5)}>clear</button>
		<button data-next onclick={() => ctx.setPage(1)}>next</button>
		<button data-sort onclick={() => ctx.setOrder('-rating')}>sort</button>
	{/snippet}
</Root>
