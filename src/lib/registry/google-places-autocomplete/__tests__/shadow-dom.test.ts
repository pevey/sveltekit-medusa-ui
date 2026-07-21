import { expect, test } from 'vitest'
import { installGpacShadowStyling, GPAC_SHADOW_CSS } from '../shadow-dom'

test('GPAC_SHADOW_CSS contains the chrome gates, sizing vars, and popover theming', () => {
	expect(GPAC_SHADOW_CSS).toContain(":host([data-gpac-search='false']) .autocomplete-icon")
	expect(GPAC_SHADOW_CSS).toContain(":host([data-gpac-close='false']) .clear-button")
	expect(GPAC_SHADOW_CSS).toContain(":host([data-gpac-location='false']) [part~='prediction-item-icon']")
	expect(GPAC_SHADOW_CSS).toContain('var(--gpac-input-height, 2.25rem)')
	expect(GPAC_SHADOW_CSS).toContain('var(--popover)')
	expect(GPAC_SHADOW_CSS).toContain('.back-button')
})

test('GPAC_SHADOW_CSS pins the row height and exposes icon vars so icons cannot inflate the row', () => {
	// .input-container height tracks --gpac-input-height (icons cannot become the tallest child)
	expect(GPAC_SHADOW_CSS).toContain('.input-container')
	expect(GPAC_SHADOW_CSS).toContain('min-height: var(--gpac-input-height, 2.25rem)')
	// icon controls are tamed + tunable via the new vars
	expect(GPAC_SHADOW_CSS).toContain('var(--gpac-icon-size, 1.125rem)')
	expect(GPAC_SHADOW_CSS).toContain('var(--gpac-icon-gap, 0.5rem)')
	// input edge padding is dropped on whichever side holds an icon, so the gap var is the single
	// source of spacing (no stacking of input padding + icon margin)
	expect(GPAC_SHADOW_CSS).toContain(":host([data-gpac-search='true']) input[part='input']")
	expect(GPAC_SHADOW_CSS).toContain(":host([data-gpac-close='true']) input[part='input']")
})

test('patches gmp-place-autocomplete: forces shadow open and injects the stylesheet', () => {
	installGpacShadowStyling()
	const el = document.createElement('gmp-place-autocomplete') // unknown element, correct localName
	el.attachShadow({ mode: 'closed' }) // patch overrides to 'open'
	expect(el.shadowRoot).not.toBeNull()
	const style = el.shadowRoot!.querySelector('style')
	expect(style?.textContent).toContain('input[part=\'input\']')
})

test('non-gmp elements pass through unpatched (closed stays closed)', () => {
	installGpacShadowStyling()
	const div = document.createElement('div')
	div.attachShadow({ mode: 'closed' })
	expect(div.shadowRoot).toBeNull()
})

test('is idempotent — a second install does not re-wrap attachShadow', () => {
	installGpacShadowStyling()
	const first = Element.prototype.attachShadow
	installGpacShadowStyling()
	expect(Element.prototype.attachShadow).toBe(first)
})
