// Ambient shim so svelte-check/tsc resolve `$app/state` without a SvelteKit app.
// Consumers get the real types from SvelteKit.
declare module '$app/state' {
	export const page: { url: URL }
}
