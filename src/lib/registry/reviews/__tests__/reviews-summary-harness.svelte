<script lang="ts">
	import { setReviewsContext } from '../reviews-ctx.svelte.js'
	import { makeReviewsContext } from './reviews-context-fixture.js'
	import { Summary } from '../index.js'
	import type { ReviewSummary } from '../../review/review-types.js'

	let { summary, count }: { summary: ReviewSummary | null; count: number } = $props()

	// Feeds `ReviewsListContext` directly with a fixed summary — no `Reviews.Root`/SDK needed
	// for a `Reviews.Summary` unit test.
	setReviewsContext(makeReviewsContext(() => ({ summary, count })))
</script>

<Summary>
	<Summary.Title />
	<Summary.Average />
	<Summary.Stars />
	<Summary.Count />
</Summary>
