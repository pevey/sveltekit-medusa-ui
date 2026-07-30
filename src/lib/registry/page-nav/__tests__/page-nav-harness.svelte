<script lang="ts">
	import * as PageNav from '../index.js'

	let { page, pageCount, pageParam = 'p' }: { page: number; pageCount: number; pageParam?: string } = $props()
</script>

<PageNav.Root {page} {pageCount} {pageParam}>
	<PageNav.Prev />
	<PageNav.Pages />
	<PageNav.Info />
	<PageNav.Next />
</PageNav.Root>
