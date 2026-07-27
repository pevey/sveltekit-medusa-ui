// Pure rating math + formatting for the Reviews components. No Svelte, unit-testable.

/** 5 fill values (0 | 0.5 | 1) for an average, snapped to the nearest half star. */
export function averageToStarFills(average: number): number[] {
	const snapped = Math.round((average || 0) * 2) / 2
	return [1, 2, 3, 4, 5].map((i) => (snapped >= i ? 1 : snapped >= i - 0.5 ? 0.5 : 0))
}

/** 5 fill values (0 | 1) for an integer review rating. */
export function ratingToStarFills(rating: number): number[] {
	return [1, 2, 3, 4, 5].map((i) => ((rating || 0) >= i ? 1 : 0))
}

/** Fraction 0–1 of a histogram bar; 0 when there are no reviews. */
export function barFill(count: number, total: number): number {
	return total > 0 ? count / total : 0
}

/** Number of pages for a review count at a given page size. */
export function pageCount(count: number, pageSize: number): number {
	return pageSize > 0 ? Math.ceil((count || 0) / pageSize) : 0
}

/** Locale date string for a review's created_at; '' when the input isn't a valid date. */
export function formatReviewDate(iso: string, locale = 'en-US'): string {
	const d = new Date(iso)
	return isNaN(d.getTime())
		? ''
		: d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}
