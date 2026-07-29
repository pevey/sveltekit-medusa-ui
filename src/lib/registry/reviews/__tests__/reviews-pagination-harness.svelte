<script lang="ts">
	import { setReviewsContext } from '../reviews-ctx.svelte.js'
	import { makeReviewsContext } from './reviews-context-fixture.js'
	import { Pagination } from '../index.js'

	let {
		filteredCount,
		pageSize = 10,
		page = 0,
		setPage
	}: { filteredCount: number; pageSize?: number; page?: number; setPage: (n: number) => void } =
		$props()

	// Feeds `ReviewsListContext` directly with a fixed page/filteredCount — no `Reviews.Root`/SDK
	// needed for a `Reviews.Pagination` unit test. `setPage` is a `vi.fn()` supplied by the test.
	setReviewsContext(makeReviewsContext(() => ({ filteredCount, pageSize, page, setPage })))
</script>

<Pagination.Root>
	<Pagination.Prev />
	<Pagination.Info />
	<Pagination.Next />
</Pagination.Root>
