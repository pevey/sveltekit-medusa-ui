<script lang="ts">
	import * as ImageZoom from '$lib/components/ui/image-zoom'

	let { srcs = ['https://example.com/a.jpg', 'https://example.com/b.jpg'] }: { srcs?: string[] } =
		$props()
</script>

<ImageZoom.Root>
	{#each srcs as s, i (s)}
		<ImageZoom.Trigger src={s} alt={`img ${i + 1}`} />
	{/each}
</ImageZoom.Root>
