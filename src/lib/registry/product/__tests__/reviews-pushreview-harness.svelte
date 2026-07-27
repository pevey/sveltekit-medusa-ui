<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import { getReviewsContext } from '$lib/components/ui/product/reviews-ctx.svelte.js'
	let { productId }: { productId: string } = $props()
</script>
<Root {productId} pageSize={10}>
	{#snippet children()}
		{@const ctx = getReviewsContext()}
		<span data-pid>{ctx.productId}</span>
		<span data-authors>{ctx.reviews.map((r) => r.author_name).join(',')}</span>
		<button data-push onclick={() => ctx.pushReview({ id: 'new1', rating: 5, body: 'Fresh', author_name: 'Zoe', created_at: '2026-03-01' } as any)}>push</button>
	{/snippet}
</Root>
