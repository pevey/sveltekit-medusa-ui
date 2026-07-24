import { expect, test } from 'vitest'
import { buildStripeAppearance } from '../stripe-appearance'

// Fake resolver: colors already normalized to rgb (as the DOM probe returns); raw for the rest.
const COLORS: Record<string, string> = {
	'--primary': 'rgb(20, 20, 20)',
	'--background': 'rgb(255, 255, 255)',
	'--foreground': 'rgb(15, 15, 15)',
	'--muted-foreground': 'rgb(120, 120, 120)',
	'--destructive': 'rgb(200, 40, 40)',
	'--border': 'rgb(230, 230, 230)',
	'--ring': 'rgb(180, 180, 180)'
}
const RAW: Record<string, string> = { '--radius': '0.5rem', '--font-sans': 'Inter, sans-serif' }
const resolve = (name: string, asColor = false) => (asColor ? COLORS[name] : RAW[name]) ?? ''

test('maps resolved shadcn tokens into Stripe appearance (colors as rgb)', () => {
	const a = buildStripeAppearance({ resolve })
	expect(a.theme).toBe('stripe')
	expect(a.variables?.colorPrimary).toBe('rgb(20, 20, 20)')
	expect(a.variables?.borderRadius).toBe('0.5rem')
	expect(a.variables?.fontFamily).toBe('Inter, sans-serif')
	expect(a.rules?.['.Input']?.border).toBe('1px solid rgb(230, 230, 230)')
	expect(a.rules?.['.Input:focus']?.boxShadow).toContain('rgb(180, 180, 180)')
})

test('omits variables/rule props whose token does not resolve (never empty strings)', () => {
	const a = buildStripeAppearance({ resolve: () => '' })
	expect(a.variables).toEqual({})
	expect(a.rules?.['.Input']?.border).toBeUndefined()
})
