<script lang="ts">
	import ResetForm from '$lib/components/ui/auth/reset-form.svelte'
	import Field from '$lib/components/ui/auth/field.svelte'
	import Label from '$lib/components/ui/auth/label.svelte'
	import Input from '$lib/components/ui/auth/input.svelte'
	import ErrorPart from '$lib/components/ui/auth/error.svelte'
	import Submit from '$lib/components/ui/auth/submit.svelte'

	let {
		token = '',
		onsuccess,
		onerror
	}: { token?: string; onsuccess?: () => void; onerror?: (r: unknown) => void } = $props()
</script>

<ResetForm {token} {onsuccess} {onerror}>
	<Field name="password"><Label>New password</Label><Input type="password" /></Field>
	<ErrorPart />
	<Submit>Reset password</Submit>
</ResetForm>
