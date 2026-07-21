import { render } from 'vitest-browser-svelte'
import { expect, test, vi, beforeEach } from 'vitest'

const { setOptions } = vi.hoisted(() => ({ setOptions: vi.fn() }))

// Each constructed "element" is a real <div> tagged so we can find it and drive events.
function makeMockPlaceEl() {
	const el = document.createElement('div')
	el.setAttribute('data-mock-gpac', '')
	return el
}
vi.mock('@googlemaps/js-api-loader', () => ({
	setOptions,
	importLibrary: vi.fn(async () => ({
		PlaceAutocompleteElement: class {
			constructor() {
				return makeMockPlaceEl()
			}
		}
	}))
}))

import GooglePlacesAutocomplete from '../google-places-autocomplete.svelte'

beforeEach(() => setOptions.mockClear())

const mockEls = () => Array.from(document.querySelectorAll('[data-mock-gpac]')) as HTMLElement[]

// Runs first: the `<script module>` loader-configured guard is shared module state that persists
// across tests within this file (Vitest browser mode isolates per file, not per test), so this must
// execute before any other test's mount has already flipped it.
test('two instances each replace their own placeholder (no id collision) and configure loader once', async () => {
	render(GooglePlacesAutocomplete, { apiKey: 'k' })
	render(GooglePlacesAutocomplete, { apiKey: 'k' })
	await vi.waitFor(() => expect(mockEls().length).toBe(2))
	expect(setOptions).toHaveBeenCalledTimes(1) // module-level guard
})

test('replaces its own placeholder, merges host class, sets data-gpac-* from icons', async () => {
	render(GooglePlacesAutocomplete, {
		apiKey: 'k',
		class: 'my-host',
		icons: { search: true } // close/location default false
	})
	await vi.waitFor(() => expect(mockEls().length).toBe(1))
	const host = mockEls()[0]
	expect(host.className).toContain('my-host')
	expect(host.className).toContain('rounded-md') // shadcn default retained via twMerge
	expect(host.getAttribute('data-gpac-search')).toBe('true')
	expect(host.getAttribute('data-gpac-close')).toBe('false')
	expect(host.getAttribute('data-gpac-location')).toBe('false')
})

test('gmp-select emits a normalized address', async () => {
	const onselect = vi.fn()
	render(GooglePlacesAutocomplete, { apiKey: 'k', onselect })
	await vi.waitFor(() => expect(mockEls().length).toBe(1))
	const host = mockEls()[0]
	const evt = new Event('gmp-select') as any
	evt.placePrediction = {
		toPlace: () => ({
			fetchFields: vi.fn(async () => {}),
			addressComponents: [
				{ types: ['locality'], longText: 'Springfield', shortText: 'Springfield' },
				{ types: ['country'], longText: 'United States', shortText: 'US' }
			]
		})
	}
	host.dispatchEvent(evt)
	await vi.waitFor(() =>
		expect(onselect).toHaveBeenCalledWith(
			expect.objectContaining({ city: 'Springfield', country_code: 'us' }),
			expect.anything()
		)
	)
})

test('input mirrors the composed inner value', async () => {
	const oninput = vi.fn()
	render(GooglePlacesAutocomplete, { apiKey: 'k', oninput })
	await vi.waitFor(() => expect(mockEls().length).toBe(1))
	const host = mockEls()[0]
	const inner = document.createElement('input')
	inner.value = 'partial addr'
	host.appendChild(inner)
	inner.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
	await vi.waitFor(() => expect(oninput).toHaveBeenCalledWith('partial addr'))
})

test('unmounting removes the host element from the DOM (onDestroy)', async () => {
	const { unmount } = await render(GooglePlacesAutocomplete, { apiKey: 'k' })
	await vi.waitFor(() => expect(mockEls().length).toBeGreaterThan(0))
	const host = mockEls()[mockEls().length - 1] // this instance's own host, not earlier tests'
	await unmount()
	expect(host.isConnected).toBe(false)
})
