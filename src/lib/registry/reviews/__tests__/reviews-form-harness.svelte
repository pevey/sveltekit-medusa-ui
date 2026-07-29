<script lang="ts">
	import { setReviewsContext } from '../reviews-ctx.svelte.js'
	import { makeReviewsContext } from './reviews-context-fixture.js'
	import { Form } from '../index.js'

	let {
		open = false,
		onOpenChange,
		productId = 'prod_1',
		pushReview
	}: {
		open?: boolean
		onOpenChange?: (open: boolean) => void
		productId?: string
		pushReview?: (review: unknown) => void
	} = $props()

	// Feeds `ReviewsListContext` directly with a fixed productId/pushReview — no `Reviews.Root`/SDK
	// list-fetch needed for a `Reviews.Form` unit test. `reviewForm` itself is mocked at the module
	// level in the test file (see `sveltekit-medusa-sdk/reviews`).
	setReviewsContext(makeReviewsContext(() => ({ productId, pushReview })))
</script>

<Form {open} {onOpenChange}>
	<Form.Author />
	<Form.Rating />
	<Form.Title />
	<Form.Body />
	<Form.Error />
	<Form.Submit>Submit review</Form.Submit>
	<Form.Cancel>Cancel</Form.Cancel>
</Form>
