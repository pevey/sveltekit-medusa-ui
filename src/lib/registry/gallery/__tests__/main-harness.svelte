<script lang="ts">
	import * as Gallery from '../index.js'
	import type { GalleryImage } from '../ctx.svelte.js'

	interface Props {
		images: GalleryImage[]
		alt?: string
		filterString?: string
		imageClass?: string
		thumbnails?: boolean
		dots?: boolean
	}
	let {
		images,
		alt = '',
		filterString,
		imageClass = '',
		thumbnails = false,
		dots = false
	}: Props = $props()
</script>

<Gallery.Root {images} {alt} {filterString}>
	{#if thumbnails}
		<Gallery.Thumbnails>
			<Gallery.ThumbnailImage />
		</Gallery.Thumbnails>
	{/if}
	<Gallery.Carousel><Gallery.Image class={imageClass} /></Gallery.Carousel>
	{#if dots}
		<Gallery.Dots />
	{/if}
</Gallery.Root>
