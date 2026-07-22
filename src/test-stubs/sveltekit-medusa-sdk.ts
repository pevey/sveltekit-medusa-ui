// Test/build stub for the sveltekit-ui package ONLY. The real
// `sveltekit-medusa-sdk` search remote imports `$app/server`, which does not
// exist outside a SvelteKit app, so we alias the whole package to this stub in
// vitest. Component tests always inject their own `search` fn, so this dummy is
// never actually invoked.
export const search = async (_args: { q: string; limit?: number }) => ({ hits: [] })
