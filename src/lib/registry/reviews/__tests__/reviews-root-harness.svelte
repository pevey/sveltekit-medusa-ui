<script lang="ts">
	import * as Reviews from '../index.js'
	import Review from '../../review/index.js'
	import type { StoreReview } from '../index.js'

	let { reviews, productId, pageSize }: { reviews?: StoreReview[]; productId?: string; pageSize?: number } = $props()
</script>

<Reviews.Root {reviews} {productId} {pageSize}>
	<Reviews.List>
		<Review>
			<Review.Author /><Review.Body />
		</Review>
	</Reviews.List>
	<Reviews.Pagination.Root>
		<Reviews.Pagination.Prev />
		<Reviews.Pagination.Info />
		<Reviews.Pagination.Next />
	</Reviews.Pagination.Root>
</Reviews.Root>
