<script lang="ts">
	import ForgotForm from '$lib/components/ui/auth/forgot-form.svelte'
	import Field from '$lib/components/ui/auth/field.svelte'
	import Label from '$lib/components/ui/auth/label.svelte'
	import Input from '$lib/components/ui/auth/input.svelte'
	import ErrorPart from '$lib/components/ui/auth/error.svelte'
	import Submit from '$lib/components/ui/auth/submit.svelte'

	let { onsuccess, onerror }: { onsuccess?: () => void; onerror?: (r: unknown) => void } = $props()
</script>

<ForgotForm {onsuccess} {onerror}>
	<Field name="email"><Label>Email</Label><Input type="email" /></Field>
	<ErrorPart />
	<Submit>Send reset link</Submit>
</ForgotForm>
