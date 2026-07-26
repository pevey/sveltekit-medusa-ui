<script lang="ts">
  import { setAuthFormContext } from '$lib/components/ui/auth/ctx.svelte.js'
  import Field from '$lib/components/ui/auth/field.svelte'
  import Label from '$lib/components/ui/auth/label.svelte'
  import Input from '$lib/components/ui/auth/input.svelte'
  import ErrorPart from '$lib/components/ui/auth/error.svelte'
  let { issues = undefined, formError = '' }: { issues?: any; formError?: string } = $props()
  const mkField = (name: string) => ({ as: (t: string) => ({ name, type: t }), issues: () => issues, value: () => '', set: () => {} })
  setAuthFormContext({
    get form() { return { fields: { email: mkField('email') } } as any },
    get error() { return formError },
    get submitting() { return false },
    get messages() { return {} }
  })
</script>

<Field name="email">
  <Label>Email</Label>
  <Input type="email" />
  <ErrorPart />
</Field>
<ErrorPart />
