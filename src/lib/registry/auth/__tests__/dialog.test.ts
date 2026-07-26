import { render } from 'vitest-browser-svelte'
import { page as vpage } from 'vitest/browser'
import { expect, test, vi } from 'vitest'

// The dialog statically imports all four Auth.*Form roots (one per mode), so all four SDK auth
// remotes must resolve — even though only the rendered mode's form actually mounts its script and
// calls into them. Field fakes need a working `.as()` so Auth.Field/Input can render without
// throwing (the real `$app/server` test-stub returns empty `fields: {}`, which is not enough).
const h = vi.hoisted(() => {
	const field = (name: string) => ({
		as: (t: string) => ({ name, type: t }),
		issues: () => undefined,
		value: () => '',
		set: () => {}
	})
	const remote = (fields: Record<string, ReturnType<typeof field>>) => ({
		pending: 0,
		result: undefined,
		fields,
		enhance: () => ({ method: 'POST', action: '' })
	})
	return {
		login: remote({ email: field('email'), password: field('password') }),
		register: remote({ email: field('email'), password: field('password') }),
		requestResetPassword: remote({ email: field('email') }),
		resetPassword: remote({ password: field('password'), token: field('token') })
	}
})

vi.mock('sveltekit-medusa-sdk/auth', () => ({
	login: h.login,
	register: h.register,
	requestResetPassword: h.requestResetPassword,
	resetPassword: h.resetPassword
}))
vi.mock('sveltekit-medusa-sdk/customer', () => ({
	getCustomer: () => ({ current: null, refresh: async () => {} })
}))
vi.mock('$app/navigation', () => ({ goto: vi.fn() }))
vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/?auth=login') } }))

// Import AFTER mocks so the component sees them.
import AuthDialog from '../auth-dialog.svelte'

test('renders the login form when ?auth=login and applies the content class', async () => {
	render(AuthDialog, { classes: { content: 'p-8 test-content' } })
	await expect.element(vpage.getByText('Sign in to your account')).toBeInTheDocument()
	await expect.element(vpage.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
	// Dialog.Content is portalled to body; assert the class landed.
	expect(document.querySelector('.test-content')).not.toBeNull()
})
