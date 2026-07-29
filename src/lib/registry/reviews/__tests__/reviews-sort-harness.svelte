<script lang="ts">
	import { setReviewsContext } from '../reviews-ctx.svelte.js'
	import { makeReviewsContext } from './reviews-context-fixture.js'
	import { Sort } from '../index.js'

	let {
		count,
		order = '-created_at',
		setOrder
	}: { count: number; order?: string; setOrder: (s: string) => void } = $props()

	// Feeds `ReviewsListContext` directly with a fixed count/order — no `Reviews.Root`/SDK needed
	// for a `Reviews.Sort` unit test. `setOrder` is a `vi.fn()` supplied by the test.
	setReviewsContext(makeReviewsContext(() => ({ count, order, setOrder })))
</script>

<Sort />
