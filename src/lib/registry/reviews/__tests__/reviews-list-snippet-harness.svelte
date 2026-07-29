<script lang="ts">
	import { setReviewsContext } from '../reviews-ctx.svelte.js'
	import List from '../reviews-list.svelte'
	import type { StoreReview } from '../../review/review-types.js'

	let { reviews }: { reviews: StoreReview[] } = $props()

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
	{#snippet children({ review })}
		<p data-raw-row>{review.author_name} says: {review.body}</p>
	{/snippet}
</List>
