import { render } from 'vitest-browser-svelte'
import { page as vpage } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import Harness from './field-harness.svelte'

test('label is associated with the input id and input renders', async () => {
  render(Harness, {})
  const label = document.querySelector('label')!
  const input = document.querySelector('input')!
  expect(label.getAttribute('for')).toBe('email')
  expect(input.id).toBe('email')
  expect(input.getAttribute('type')).toBe('email')
})

test('field-level Auth.Error shows field issues; form-level shows the form error', async () => {
  render(Harness, { issues: [{ message: 'Required', path: [] }], formError: 'Invalid email or password.' })
  await expect.element(vpage.getByText('Required')).toBeInTheDocument()
  // Both the field-level Field.FieldError and the form-level <p> render role="alert",
  // so scope to the form-level one (rendered last, outside <Auth.Field>) to disambiguate.
  await expect.element(vpage.getByRole('alert').last()).toHaveTextContent('Invalid email or password.')
})
