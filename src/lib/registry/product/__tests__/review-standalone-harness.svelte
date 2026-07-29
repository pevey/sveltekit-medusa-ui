<script lang="ts">
	import Review from '../../review/review.svelte'
	import Author from '../../review/review-author.svelte'
	import Rating from '../../review/review-rating.svelte'
	let { review }: { review: any } = $props()
</script>

<Review {review}><Rating /><Author /></Review>
