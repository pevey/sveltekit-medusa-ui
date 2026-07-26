<script lang="ts">
	import * as Gallery from '../index.js'
	import type { GalleryImage, ThumbnailPosition, ThumbnailBreakpoint } from '../ctx.svelte.js'

	interface Props {
		images: GalleryImage[]
		alt?: string
		filterString?: string
		imageClass?: string
		thumbnails?: ThumbnailPosition
		thumbnailBreakpoint?: ThumbnailBreakpoint
		zoom?: boolean
	}
	let {
		images,
		alt = '',
		filterString,
		imageClass = '',
		thumbnails = 'bottom',
		thumbnailBreakpoint = 'md',
		zoom = false
	}: Props = $props()
	let selectedIndex = $state(0)
</script>

<Gallery.Root
	{images}
	{alt}
	{filterString}
	{thumbnails}
	{thumbnailBreakpoint}
	{zoom}
	bind:selectedIndex
>
	{#if thumbnails !== 'none'}
		<Gallery.Thumbnails>
			<Gallery.ThumbnailImage />
		</Gallery.Thumbnails>
	{/if}
	<Gallery.Main>
		<Gallery.Carousel><Gallery.Image class={imageClass} /></Gallery.Carousel>
		<Gallery.Dots />
	</Gallery.Main>
</Gallery.Root>
<output data-testid="selected">{selectedIndex}</output>
