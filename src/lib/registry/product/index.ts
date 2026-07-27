import Root from './product.svelte'
import Title from './product-title.svelte'
import Subtitle from './product-subtitle.svelte'
import Description from './product-description.svelte'
import Price from './product-price.svelte'
import Options from './product-options.svelte'
import OptionButton from './product-option-button.svelte'
import QuantitySelect from './product-quantity-select.svelte'
import JsonLd from './product-jsonld.svelte'
import Rating from './product-rating.svelte'
import Star from './star.svelte'
import ReviewsRoot from './product-reviews.svelte'
import SummaryRoot from './product-reviews-summary.svelte'
import SummaryTitle from './product-reviews-summary-title.svelte'
import SummaryAverage from './product-reviews-summary-average.svelte'
import SummaryStars from './product-reviews-summary-stars.svelte'
import SummaryCount from './product-reviews-summary-count.svelte'
import HistogramRoot from './product-reviews-histogram.svelte'
import HistogramBar from './product-reviews-histogram-bar.svelte'
import HistogramLabel from './product-reviews-histogram-label.svelte'
import Sort from './product-reviews-sort.svelte'
import ListRoot from './product-reviews-list.svelte'
import ReviewRoot from './review.svelte'
import ReviewTitle from './review-title.svelte'
import ReviewRating from './review-rating.svelte'
import ReviewDate from './review-date.svelte'
import ReviewAuthor from './review-author.svelte'
import ReviewBody from './review-body.svelte'
import PaginationRoot from './product-reviews-pagination.svelte'
import PaginationPrev from './product-reviews-pagination-prev.svelte'
import PaginationNext from './product-reviews-pagination-next.svelte'
import PaginationInfo from './product-reviews-pagination-info.svelte'
import FormRoot from './product-reviews-form.svelte'
import FormAuthor from './product-reviews-form-author.svelte'
import FormRating from './product-reviews-form-rating.svelte'
import FormTitle from './product-reviews-form-title.svelte'
import FormBody from './product-reviews-form-body.svelte'
import FormSubmit from './product-reviews-form-submit.svelte'
import FormCancel from './product-reviews-form-cancel.svelte'
import FormError from './product-reviews-form-error.svelte'

const Summary = Object.assign(SummaryRoot, {
	Root: SummaryRoot,
	Title: SummaryTitle,
	Average: SummaryAverage,
	Stars: SummaryStars,
	Count: SummaryCount,
	Histogram: Object.assign(HistogramRoot, { Root: HistogramRoot, Bar: HistogramBar, Label: HistogramLabel })
})
const Review = Object.assign(ReviewRoot, {
	Root: ReviewRoot,
	Title: ReviewTitle,
	Rating: ReviewRating,
	Date: ReviewDate,
	Author: ReviewAuthor,
	Body: ReviewBody
})
const Pagination = Object.assign(PaginationRoot, {
	Root: PaginationRoot,
	Prev: PaginationPrev,
	Next: PaginationNext,
	Info: PaginationInfo
})
const Form = Object.assign(FormRoot, {
	Root: FormRoot,
	Author: FormAuthor,
	Rating: FormRating,
	Title: FormTitle,
	Body: FormBody,
	Submit: FormSubmit,
	Cancel: FormCancel,
	Error: FormError
})
export const Reviews = Object.assign(ReviewsRoot, {
	Root: ReviewsRoot,
	Summary,
	Sort,
	List: ListRoot,
	Review,
	Pagination,
	Form
})

export { Root, Title, Subtitle, Description, Price, Options, OptionButton, QuantitySelect, JsonLd, Rating, Star }
export { getProductContext, getProductContextOptional, setProductContext } from './ctx.svelte.js'
export type { ProductContext } from './ctx.svelte.js'
export { formatPrice } from './format-price.js'
export { productSchema } from './product-schema.js'
export type { ProductSchemaOpts } from './product-schema.js'
export type { StoreReview, ReviewSummary, ReviewsListResponse, SummaryQuery, ReviewsQuery } from './review-types.js'
export * as logic from './product-logic.js'
export * as reviewsLogic from './reviews-logic.js'
