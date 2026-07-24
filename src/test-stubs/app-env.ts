// Test stub for `$app/env` (SvelteKit v3 virtual). `sveltekit-stripe`'s components import
// `{ dev, browser }` from it; that virtual only exists inside a SvelteKit app, so vitest aliases
// `$app/env` here so those imports resolve when a checkout test loads the Stripe components.
export const dev = true
export const browser = true
