import { getContext, setContext } from 'svelte'
import type { ReviewSummary, StoreReview } from './review-types.js'

// The reactive reviews context. `Product.Reviews` builds this from `$derived` SDK queries +
// internal `$state` for rating/order/page — no `$effect`, so it works during SSR.
export type ReviewsContext = {
	readonly summary: ReviewSummary | null | undefined
	readonly reviews: StoreReview[]
	readonly count: number
	readonly filteredCount: number
	readonly loading: boolean
	readonly error: unknown
	readonly rating: number | null
	readonly order: string
	readonly page: number
	readonly pageSize: number
	readonly productId: string
	pushReview: (review: StoreReview) => void
	setRating: (n: number | null) => void
	setOrder: (s: string) => void
	setPage: (n: number) => void
}
export type ReviewItemContext = { readonly review: StoreReview }

const REVIEWS = Symbol('reviews')
const ITEM = Symbol('review-item')

export function setReviewsContext(ctx: ReviewsContext) {
	setContext(REVIEWS, ctx)
}
export function getReviewsContext(): ReviewsContext {
	const ctx = getContext<ReviewsContext>(REVIEWS)
	if (!ctx) throw new Error('Product.Reviews.* must be used within <Product.Reviews>')
	return ctx
}
export function getReviewsContextOptional(): ReviewsContext | null {
	return getContext<ReviewsContext>(REVIEWS) ?? null
}

export function setReviewItemContext(ctx: ReviewItemContext) {
	setContext(ITEM, ctx)
}
export function getReviewItemContextOptional(): ReviewItemContext | null {
	return getContext<ReviewItemContext>(ITEM) ?? null
}

// Per-level context for `Product.Reviews.Summary.Histogram` — set by the internal
// `product-reviews-histogram-level.svelte` provider, read by `Bar`/`Label`.
export type HistogramLevelContext = {
	readonly level: number
	readonly count: number
	readonly fill: number
	readonly active: boolean
	readonly orientation: 'horizontal' | 'vertical'
	select: () => void
}
const LEVEL = Symbol('histogram-level')

export function setHistogramLevelContext(ctx: HistogramLevelContext) {
	setContext(LEVEL, ctx)
}
export function getHistogramLevelContext(): HistogramLevelContext {
	const ctx = getContext<HistogramLevelContext>(LEVEL)
	if (!ctx) throw new Error('Histogram parts must be used within <Product.Reviews.Summary.Histogram>')
	return ctx
}
