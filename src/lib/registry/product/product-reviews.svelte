<script lang="ts">
	import { cn } from '$lib/utils.js'
	// Import review remotes from the /reviews subpath: svelte-check cannot resolve them
	// through the package barrel (the SDK's ./* export maps this straight to reviews.remote).
	import { getReviewSummary, getReviews } from 'sveltekit-medusa-sdk/reviews'
	import { getProductContextOptional } from './ctx.svelte.js'
	import { setReviewsContext } from './reviews-ctx.svelte.js'
	import type { SummaryQuery, ReviewsQuery } from './review-types.js'
	import type { Snippet } from 'svelte'

	let {
		productId,
		pageSize = 10,
		class: className = '',
		children
	}: { productId?: string; pageSize?: number; class?: string; children: Snippet } = $props()

	const id = $derived(productId ?? getProductContextOptional()?.product?.id ?? '')

	let rating = $state<number | null>(null)
	let order = $state('-created_at')
	let page = $state(0)
	let submitted = $state<import('./review-types.js').StoreReview[]>([])

	const summaryQ = $derived(
		id ? (getReviewSummary({ productId: id }) as unknown as SummaryQuery) : null
	)
	const listQ = $derived(
		id
			? (getReviews({
					productId: id,
					order,
					limit: pageSize,
					offset: page * pageSize,
					...(rating ? { rating } : {})
				}) as unknown as ReviewsQuery)
			: null
	)

	setReviewsContext({
		get summary() {
			return summaryQ?.current
		},
		get productId() {
			return id
		},
		get reviews() {
			const list = listQ?.current?.reviews ?? []
			if (!submitted.length) return list
			const seen = new Set(submitted.map((r) => r.id))
			return [...submitted, ...list.filter((r) => !seen.has(r.id))]
		},
		get count() {
			return summaryQ?.current?.count ?? 0
		},
		get filteredCount() {
			return listQ?.current?.count ?? summaryQ?.current?.count ?? 0
		},
		get loading() {
			return (summaryQ?.loading || listQ?.loading) ?? false
		},
		get error() {
			return summaryQ?.error ?? listQ?.error
		},
		get rating() {
			return rating
		},
		get order() {
			return order
		},
		get page() {
			return page
		},
		get pageSize() {
			return pageSize
		},
		setRating: (n) => {
			rating = rating === n ? null : n
			page = 0
		},
		setOrder: (s) => {
			order = s
			page = 0
		},
		setPage: (n) => {
			page = n
		},
		pushReview: (review) => {
			submitted = [review, ...submitted.filter((r) => r.id !== review.id)]
		}
	})
</script>

<div class={cn('', className)} data-product-reviews>
	{@render children()}
</div>
