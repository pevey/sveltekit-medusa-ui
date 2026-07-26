<script lang="ts">
	import SignOut from '$lib/components/ui/customer/sign-out.svelte'
	let { onsignout }: { onsignout?: () => void } = $props()
</script>

<SignOut {onsignout} />
