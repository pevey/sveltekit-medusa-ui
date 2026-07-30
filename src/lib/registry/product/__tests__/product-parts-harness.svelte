<script lang="ts">
	import { createProductContext, setProductContext } from '../ctx.svelte.js'
	import Title from '../product-title.svelte'
	import Thumbnail from '../product-thumbnail.svelte'
	import PriceMin from '../product-price-min.svelte'
	import PriceMax from '../product-price-max.svelte'
	import type { StoreProduct } from '@medusajs/types'

	let { product, as = 'h1' }: { product: StoreProduct; as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' } = $props()

	setProductContext(createProductContext({ product: () => product, selection: 'local' }))
</script>

<Title {as} />
<Thumbnail />
<PriceMin />
<PriceMax />
