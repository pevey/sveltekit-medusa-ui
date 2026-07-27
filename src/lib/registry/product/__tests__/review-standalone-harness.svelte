<script lang="ts">
	import Review from '$lib/components/ui/product/review.svelte'
	import Author from '$lib/components/ui/product/review-author.svelte'
	import Rating from '$lib/components/ui/product/review-rating.svelte'
	let { review }: { review: any } = $props()
</script>

<Review {review}><Rating /><Author /></Review>
