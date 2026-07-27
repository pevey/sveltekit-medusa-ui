import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test } from 'vitest'
import Harness from './star-harness.svelte'

test('renders a star svg with a fractional gradient stop', async () => {
	const { container } = await render(Harness, { fill: 0.5 })
	const stop = container.querySelector('stop')
	expect(stop?.getAttribute('offset')).toBe('50%')
	expect(container.querySelector('polygon')).toBeTruthy()
})

test('clamps fill to [0,1]', async () => {
	const { container } = await render(Harness, { fill: 2 })
	expect(container.querySelector('stop')?.getAttribute('offset')).toBe('100%')
})
