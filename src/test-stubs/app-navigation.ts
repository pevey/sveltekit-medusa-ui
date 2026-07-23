// Stub for `$app/navigation` in this package's own vitest (there is no SvelteKit runtime).
// Components import `goto` as the default for `navigate`/`redirectTo`, but tests always inject
// their own `navigate` fn, so this no-op is never actually invoked.
export const goto = async (_url: string) => {}
