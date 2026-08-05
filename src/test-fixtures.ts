/**
 * Address every test fixture uses when it needs an email. Sourced from `RECIPIENT_EMAIL` in the
 * monorepo-root `.env.test` (see `envDir`/`envPrefix` in vitest.config.ts) so a suite run against
 * an environment with live email delivers to a real mailbox instead of bouncing off an invented
 * domain. The fallback is IANA-reserved and never routes anywhere.
 */
export const TEST_EMAIL = import.meta.env.RECIPIENT_EMAIL ?? 'test@example.com'
