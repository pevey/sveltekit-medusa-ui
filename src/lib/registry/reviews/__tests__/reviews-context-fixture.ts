import type { ReviewsListContext } from '../reviews-ctx.svelte.js'

// Pure builder for a fixed `ReviewsListContext` — no Svelte, so it's safe to import from any
// test harness `.svelte` file (which calls `setReviewsContext(makeReviewsContext(...))` during
// component init) as well as directly from a `.test.ts`. Takes a thunk (not a plain object) so
// each field is read lazily through a closure — reading a harness's reactive props eagerly at
// call time trips Svelte's `state_referenced_locally` warning; deferring through `get()` avoids
// it and mirrors how `reviews-list-subcomponent-harness.svelte` wires its own getters directly.
// Every field defaults to a no-op/empty value so callers only need to supply what a given test
// exercises.
export function makeReviewsContext(get: () => Partial<ReviewsListContext> = () => ({})): ReviewsListContext {
	return {
		get reviews() {
			return get().reviews ?? []
		},
		get count() {
			return get().count ?? (get().reviews ?? []).length
		},
		get filteredCount() {
			const o = get()
			return o.filteredCount ?? o.count ?? (o.reviews ?? []).length
		},
		get loading() {
			return get().loading ?? false
		},
		get error() {
			return get().error
		},
		get rating() {
			return get().rating ?? null
		},
		get order() {
			return get().order ?? '-created_at'
		},
		get page() {
			return get().page ?? 0
		},
		get pageSize() {
			return get().pageSize ?? 10
		},
		get summary() {
			return get().summary ?? null
		},
		get productId() {
			return get().productId ?? ''
		},
		pushReview: (review) => get().pushReview?.(review),
		setRating: (n) => get().setRating?.(n),
		setOrder: (s) => get().setOrder?.(s),
		setPage: (n) => get().setPage?.(n)
	}
}
