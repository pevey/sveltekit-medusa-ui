<script lang="ts">
	import MetaProvider from '$lib/components/ui/seo/meta-provider.svelte'
	import Metadata from '$lib/components/ui/seo/metadata.svelte'
	import type { SiteMeta, MetaConfig } from '$lib/components/ui/seo/types.js'
	let { site, config, withProvider = true }:
		{ site?: SiteMeta; config?: MetaConfig; withProvider?: boolean } = $props()
</script>

{#if withProvider}
	<MetaProvider {site}><Metadata {config} /></MetaProvider>
{:else}
	<Metadata {config} />
{/if}
