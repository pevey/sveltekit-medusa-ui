<script lang="ts">
	import { AddressFormCollapsed } from '$lib/components/ui/address/index.js'
	let { form, googlePlacesApiKey = undefined } = $props()
</script>

<AddressFormCollapsed {form} {googlePlacesApiKey} />
