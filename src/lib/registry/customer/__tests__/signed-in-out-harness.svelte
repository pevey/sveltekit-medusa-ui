<script lang="ts">
	import SignedIn from '$lib/components/ui/customer/signed-in.svelte'
	import SignedOut from '$lib/components/ui/customer/signed-out.svelte'
</script>

<svelte:boundary>
	<SignedIn>
		<span data-testid="signed-in">In</span>
	</SignedIn>
	<SignedOut>
		<span data-testid="signed-out">Out</span>
	</SignedOut>
	{#snippet pending()}<span data-testid="loading">loading</span>{/snippet}
</svelte:boundary>
