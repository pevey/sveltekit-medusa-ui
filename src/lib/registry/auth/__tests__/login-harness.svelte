<script lang="ts">
	import LoginForm from '$lib/components/ui/auth/login-form.svelte'
	import Field from '$lib/components/ui/auth/field.svelte'
	import Label from '$lib/components/ui/auth/label.svelte'
	import Input from '$lib/components/ui/auth/input.svelte'
	import ErrorPart from '$lib/components/ui/auth/error.svelte'
	import Submit from '$lib/components/ui/auth/submit.svelte'

	let { onsuccess, onerror }: { onsuccess?: () => void; onerror?: (r: unknown) => void } = $props()
</script>

<LoginForm {onsuccess} {onerror}>
	<Field name="email"><Label>Email</Label><Input type="email" /></Field>
	<Field name="password"><Label>Password</Label><Input type="password" /></Field>
	<ErrorPart />
	<Submit>Sign in</Submit>
</LoginForm>
