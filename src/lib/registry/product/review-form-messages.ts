import type { ReviewFormMessages } from './review-types.js'

export type { ReviewFormMessages } from './review-types.js'

export const reviewMessages: ReviewFormMessages = {
	unauthenticated: 'Please sign in to write a review.',
	error: 'Something went wrong. Please try again.',
	network: 'Could not reach the server. Please check your connection and try again.',
	unknown: 'Something went wrong. Please try again.'
}

export function resolveReviewMessage(messages: ReviewFormMessages, code: string | undefined): string {
	return messages[code ?? 'unknown'] ?? messages.unknown ?? 'Something went wrong. Please try again.'
}
