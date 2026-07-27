import { getContext, setContext } from 'svelte'
import type { ReviewFormContext } from './review-types.js'

export type { ReviewFormResult, ReviewForm, ReviewFormContext } from './review-types.js'

const REVIEW_FORM = Symbol('review-form')

export function setReviewFormContext(ctx: ReviewFormContext) {
	setContext(REVIEW_FORM, ctx)
}
export function getReviewFormContext(): ReviewFormContext {
	const ctx = getContext<ReviewFormContext>(REVIEW_FORM)
	if (!ctx) throw new Error('Product.Reviews.Form.* must be used within <Product.Reviews.Form>')
	return ctx
}
