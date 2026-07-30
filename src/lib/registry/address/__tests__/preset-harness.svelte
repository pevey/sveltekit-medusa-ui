<script lang="ts">
	import { AddressForm } from '$lib/components/ui/address/index.js'
	import type { RemoteForm } from '@sveltejs/kit'
	let {
		form,
		googlePlacesApiKey
	}: {
		form: RemoteForm<any, any>
		googlePlacesApiKey?: string
	} = $props()
</script>

<AddressForm {form} {googlePlacesApiKey} />
