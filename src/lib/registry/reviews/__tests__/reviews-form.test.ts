import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { expect, test, vi, beforeEach } from 'vitest'

// Fake the SDK remote-form the component imports directly (mirrors `login.test.ts`'s pattern for
// `sveltekit-medusa-sdk/auth`'s `login`). `reviewForm.enhance` captures the submit callback so a
// test could drive it, though these tests only cover rendering + the Cancel/open-toggle wiring —
// productId/pushReview come through the `Reviews.*` context instead, via the harness.
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string, value?: unknown) => (value === undefined ? { name, type: t } : { name, type: t, value }),
		issues: () => undefined,
		value: () => '',
		set: () => {}
	})
	const reviewForm: any = {
		pending: 0,
		result: undefined,
		cb: null,
		fields: {
			author_name: field('author_name'),
			rating: field('rating'),
			title: field('title'),
			body: field('body')
		},
		enhance(callback: any) {
			reviewForm.cb = callback
			return { method: 'POST', action: '' }
		}
	}
	return { reviewForm }
})

vi.mock('sveltekit-medusa-sdk/reviews', async orig => ({
	...(await orig<Record<string, unknown>>()),
	reviewForm: h.reviewForm
}))

import Harness from './reviews-form-harness.svelte'

beforeEach(() => {
	h.reviewForm.pending = 0
	h.reviewForm.result = undefined
	h.reviewForm.cb = null
})

test('hidden when open is false', async () => {
	const { container } = await render(Harness, { open: false })
	expect(container.querySelector('[data-review-form]')).toBeNull()
})

test('renders Author/Rating/Title/Body/Submit/Cancel when open', async () => {
	const { container } = await render(Harness, { open: true })
	expect(container.querySelector('[data-review-form]')).not.toBeNull()
	await expect.element(page.getByLabelText('Name')).toBeInTheDocument()
	await expect.element(page.getByLabelText('Title (optional)')).toBeInTheDocument()
	await expect.element(page.getByLabelText('Review')).toBeInTheDocument()
	await expect.element(page.getByRole('radiogroup', { name: 'Rating' })).toBeInTheDocument()
	await expect.element(page.getByRole('button', { name: 'Submit review' })).toBeInTheDocument()
	await expect.element(page.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
})

test('Cancel fires onOpenChange(false)', async () => {
	const onOpenChange = vi.fn()
	await render(Harness, { open: true, onOpenChange })
	await page.getByRole('button', { name: 'Cancel' }).click()
	expect(onOpenChange).toHaveBeenCalledWith(false)
})
