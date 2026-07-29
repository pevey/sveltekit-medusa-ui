<script lang="ts">
	import Root from '$lib/components/ui/customer/customer-reviews.svelte'
	import List from '../../reviews/reviews-list.svelte'
	import Review from '../../review/review.svelte'
	import Title from '../../review/review-title.svelte'
	import Author from '../../review/review-author.svelte'
	import Body from '../../review/review-body.svelte'
	import Product from '../customer-review-product.svelte'
	import Delete from '../customer-review-delete.svelte'
</script>

<Root pageSize={10}>
	<List>
		<Review>
			<Title /><Author /><Body />
			<Product />
			<Delete />
		</Review>
	</List>
</Root>
