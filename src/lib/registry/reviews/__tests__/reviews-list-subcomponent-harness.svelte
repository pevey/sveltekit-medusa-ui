<script lang="ts">
	import { setReviewsContext } from '../reviews-ctx.svelte.js'
	import List from '../reviews-list.svelte'
	import Review from '../../review/index.js'
	import type { StoreReview } from '../../review/review-types.js'

	let { reviews }: { reviews: StoreReview[] } = $props()

	// Feeds `ReviewsListContext` directly with a fixed array — no `Reviews.Root`/SDK needed
	// for a `Reviews.List` unit test.
	setReviewsContext({
		get reviews() {
			return reviews
		},
		get count() {
			return reviews.length
		},
		get filteredCount() {
			return reviews.length
		},
		get loading() {
			return false
		},
		get error() {
			return undefined
		},
		get rating() {
			return null
		},
		get order() {
			return '-created_at'
		},
		get page() {
			return 0
		},
		get pageSize() {
			return 10
		},
		get summary() {
			return null
		},
		get productId() {
			return ''
		},
		pushReview: () => {},
		setRating: () => {},
		setOrder: () => {},
		setPage: () => {}
	})
</script>

<List>
	<Review>
		<Review.Author /><Review.Body /><Review.Rating />
	</Review>
</List>
