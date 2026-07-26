<script lang="ts">
	import { setAuthFormContext } from '$lib/components/ui/auth/ctx.svelte.js'
	import Submit from '$lib/components/ui/auth/submit.svelte'
	let { submitting = false }: { submitting?: boolean } = $props()
	setAuthFormContext({
		get form() {
			return { fields: {} } as any
		},
		get error() {
			return ''
		},
		get submitting() {
			return submitting
		},
		get messages() {
			return {}
		}
	})
</script>

<Submit>Sign in</Submit>
