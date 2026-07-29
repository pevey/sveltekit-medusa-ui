<script lang="ts">
	import * as Reviews from '../index.js'
	import Review from '../../review/index.js'
	import type { StoreReview } from '../index.js'

	let { reviews, class: className }: { reviews: StoreReview[]; class?: string } = $props()
</script>

<Reviews.Carousel {reviews} class={className}>
	<Review>
		<Review.Author /><Review.Rating />
	</Review>
</Reviews.Carousel>
