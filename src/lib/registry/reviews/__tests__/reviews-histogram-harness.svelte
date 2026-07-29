<script lang="ts">
	import { setReviewsContext } from '../reviews-ctx.svelte.js'
	import { makeReviewsContext } from './reviews-context-fixture.js'
	import { Summary } from '../index.js'
	import type { ReviewSummary } from '../../review/review-types.js'

	let {
		summary,
		count,
		rating = null,
		setRating
	}: {
		summary: ReviewSummary | null
		count: number
		rating?: number | null
		setRating: (n: number | null) => void
	} = $props()

	// Feeds `ReviewsListContext` directly with a fixed summary/distribution — no `Reviews.Root`/SDK
	// needed for a `Reviews.Summary.Histogram` unit test. `setRating` is a `vi.fn()` supplied by
	// the test so clicks can be asserted.
	setReviewsContext(makeReviewsContext(() => ({ summary, count, rating, setRating })))
</script>

<Summary.Histogram>
	<Summary.Histogram.Label />
	<Summary.Histogram.Bar />
</Summary.Histogram>
