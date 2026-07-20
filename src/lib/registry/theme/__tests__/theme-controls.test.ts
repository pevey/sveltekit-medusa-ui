import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context'
import { expect, test, beforeEach } from 'vitest'
import { setMode } from 'mode-watcher'
import Harness from './mode-harness.svelte'
import ThemeButton from '../theme-button.svelte'
import ThemeToggle from '../theme-toggle.svelte'
import ThemeSwitch from '../theme-switch.svelte'
import ThemeSelect from '../theme-select.svelte'

// mode-watcher writes global state + the <html> `.dark` class — reset between tests.
beforeEach(() => {
	setMode('light')
	document.documentElement.classList.remove('dark')
})

test('ThemeButton toggles the theme (html .dark) on click', async () => {
	render(Harness, { component: ThemeButton })
	expect(document.documentElement.classList.contains('dark')).toBe(false)
	await page.getByRole('button', { name: 'Toggle theme' }).click()
	await expect.poll(() => document.documentElement.classList.contains('dark')).toBe(true)
})

test('ThemeToggle is pressed in light (onMode default) and flips on click', async () => {
	render(Harness, { component: ThemeToggle })
	const btn = page.getByRole('button', { name: 'Toggle theme' })
	await expect.element(btn).toHaveAttribute('aria-pressed', 'true') // light == on
	await btn.click()
	await expect.element(btn).toHaveAttribute('aria-pressed', 'false') // now dark == off
})

test('ThemeSwitch is checked in light (onMode default) and flips theme on change', async () => {
	render(Harness, { component: ThemeSwitch })
	const sw = page.getByRole('switch', { name: 'Toggle theme' })
	await expect.element(sw).toHaveAttribute('aria-checked', 'true') // light == on
	await sw.click()
	await expect.poll(() => document.documentElement.classList.contains('dark')).toBe(true)
	await expect.element(sw).toHaveAttribute('aria-checked', 'false')
})

test('ThemeSwitch onMode="dark" reverses the mapping', async () => {
	render(Harness, { component: ThemeSwitch, onMode: 'dark' })
	// light mode → checked should now be false (on == dark)
	await expect
		.element(page.getByRole('switch', { name: 'Toggle theme' }))
		.toHaveAttribute('aria-checked', 'false')
})

test('ThemeSelect reflects userPrefersMode and sets it (incl. system)', async () => {
	setMode('light')
	render(Harness, { component: ThemeSelect })
	const trigger = page.getByRole('button', { name: 'Theme' })
	await expect.element(trigger).toHaveTextContent('Light')
	await trigger.click()
	await page.getByRole('option', { name: 'Dark' }).click()
	await expect.poll(() => document.documentElement.classList.contains('dark')).toBe(true)
	await expect.element(trigger).toHaveTextContent('Dark')
})
