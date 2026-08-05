// Types for the `import.meta.env` keys this package reads. Declared here rather than pulling in
// `vite/client`, whose `declare module '*.css'` collides with the shorthand one in css.d.ts.
interface ImportMetaEnv {
	readonly DEV: boolean
	/** Test-fixture recipient, from `RECIPIENT_EMAIL` in the monorepo-root `.env.test`. */
	readonly RECIPIENT_EMAIL?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
