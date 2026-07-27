import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

// Fake the SDK remotes the component imports directly. All test scaffolding lives here —
// the component stays free of injection props. Copied from review-form.test.ts's `field()`
// helper; `reviewForm.fields` covers every field the field/control subcomponents read.
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string, _value?: string | number) => ({ name, type: t }),
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

import Harness from './review-form-fields-harness.svelte'

beforeEach(() => {
	h.reviewForm.result = undefined
	h.reviewForm.cb = null
	h.reviewForm.pending = 0
})

test('renders the name and review inputs bound to the form fields', async () => {
	const { container } = await render(Harness, {})
	expect(container.querySelector('input#author_name, input[name="author_name"]')).toBeTruthy()
	expect(container.querySelector('textarea')).toBeTruthy()
})

test('rating renders 5 selectable stars', async () => {
	const { container } = await render(Harness, {})
	expect(container.querySelectorAll('[data-review-rating] input[type="radio"]').length).toBe(5)
	expect(container.querySelectorAll('[data-review-rating] svg').length).toBe(5)
})

test('Cancel closes the form (onOpenChange false)', async () => {
	const onOpenChange = vi.fn()
	await render(Harness, { onOpenChange })
	await vpage.getByRole('button', { name: 'Cancel' }).click()
	expect(onOpenChange).toHaveBeenCalledWith(false)
})
