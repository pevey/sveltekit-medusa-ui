<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import List from '$lib/components/ui/product/product-reviews-list.svelte'
	import Review from '$lib/components/ui/product/review.svelte'
	import Title from '$lib/components/ui/product/review-title.svelte'
	import Author from '$lib/components/ui/product/review-author.svelte'
	import Body from '$lib/components/ui/product/review-body.svelte'
	let { productId }: { productId: string } = $props()
</script>

<Root {productId} pageSize={10}>
	<List>
		<Review>
			<Title /><Author /><Body />
		</Review>
	</List>
</Root>
