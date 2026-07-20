<script lang="ts">
	import Gallery1 from '../gallery1.svelte'
	import type { GalleryImage } from '../ctx.svelte.js'

	let { images, alt = '' }: { images: GalleryImage[]; alt?: string } = $props()
	let selectedIndex = $state(0)
</script>

<Gallery1 {images} {alt} bind:selectedIndex />
<output data-testid="selected">{selectedIndex}</output>
