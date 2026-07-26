// Test stub for `$app/server` (SvelteKit virtual, only real inside an app). The SDK's built remote
// modules (`*.remote.js`) import `query`/`command`/`form`/`getRequestEvent` from it. Tests that
// vi.mock the SDK subpaths still need those real modules to TRANSFORM (vite processes the import
// graph), so this makes the virtual resolvable. The factories are no-ops — vi.mock replaces the
// remote modules' actual exports at runtime, so these are never exercised.
export const query = (..._args: unknown[]) =>
	Object.assign(async () => undefined, { current: undefined, refresh: async () => {} })
export const command = (..._args: unknown[]) => Object.assign(async () => undefined, { pending: 0 })
export const form = (..._args: unknown[]) => ({
	pending: 0,
	result: undefined,
	fields: {},
	enhance: () => ({}),
	submit: async () => {}
})
export const prerender = (..._args: unknown[]) =>
	Object.assign(async () => undefined, { current: undefined })
export const getRequestEvent = () => ({
	cookies: { get: () => undefined, set: () => {}, delete: () => {} },
	request: new Request('http://localhost'),
	url: new URL('http://localhost'),
	setHeaders: () => {},
	locals: {},
	params: {},
	getClientAddress: () => ''
})
