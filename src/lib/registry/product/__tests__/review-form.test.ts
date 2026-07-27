import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

// Fake the SDK remotes the component imports directly. All test scaffolding lives here —
// the component stays free of injection props. `reviewForm.enhance` captures the submit
// handler so the test can drive it; the test's `submit` sets `reviewForm.result`.
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string) => ({ name, type: t }),
		issues: () => undefined,
		value: () => '',
		set: () => {}
	})
	const reviewForm: any = {
		pending: 0,
		result: undefined,
		cb: null,
		fields: {
			productId: field('productId'),
			author_name: field('author_name'),
			rating: field('rating'),
			title: field('title'),
			body: field('body')
		},
		enhance(callback: any) {
			reviewForm.cb = callback
			return { method: 'POST', action: '' }
		},
		submit: vi.fn(async () => true)
	}
	return {
		reviewForm,
		getReviewSummary: vi.fn(
			(_a?: Record<string, unknown>) =>
				({ current: { average: 5, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } }) as any
		),
		getReviews: vi.fn((_a?: Record<string, unknown>) => ({ current: { reviews: [], count: 0 } }) as any)
	}
})
vi.mock('sveltekit-medusa-sdk/reviews', () => ({
	reviewForm: h.reviewForm,
	getReviewSummary: h.getReviewSummary,
	getReviews: h.getReviews
}))

import Harness from './review-form-harness.svelte'

beforeEach(() => {
	h.reviewForm.result = undefined
	h.reviewForm.cb = null
	h.reviewForm.pending = 0
})

test('open=false renders no form', async () => {
	const { container } = await render(Harness, { open: false })
	expect(container.querySelector('[data-review-form]')).toBeNull()
})

test('successful submit pushes the review and fires onsuccess', async () => {
	const review = { id: 'new', rating: 5, body: 'Loved it', author_name: 'Zoe', created_at: '2026-03-01' }
	h.reviewForm.submit = vi.fn(async () => {
		h.reviewForm.result = { ok: true, review }
		return true
	})
	const onsuccess = vi.fn()
	await render(Harness, { open: true, onsuccess })
	await h.reviewForm.cb({ submit: h.reviewForm.submit })
	expect(h.reviewForm.submit).toHaveBeenCalled()
	expect(onsuccess).toHaveBeenCalledWith(review)
	await expect.element(vpage.getByText('Zoe')).toBeInTheDocument() // pushed into the List
})

test('failed submit shows mapped error copy and fires onerror', async () => {
	h.reviewForm.submit = vi.fn(async () => {
		h.reviewForm.result = { ok: false, code: 'unauthenticated' }
		return true
	})
	const onerror = vi.fn()
	await render(Harness, { open: true, onerror })
	await h.reviewForm.cb({ submit: h.reviewForm.submit })
	await expect.element(vpage.getByText('Please sign in to write a review.')).toBeInTheDocument()
	expect(onerror).toHaveBeenCalledWith({ ok: false, code: 'unauthenticated' })
})
