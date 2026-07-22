<script lang="ts">
	import { getSearchContext, type SearchHit } from '$lib/components/ui/search/ctx.svelte.js'

	let { hits }: { hits: SearchHit[] } = $props()

	const state = getSearchContext()

	$effect(() => {
		state.hits = hits
		state.query = 'coffee'
		state.open = true
	})
</script>
