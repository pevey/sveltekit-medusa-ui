<script lang="ts">
	import Rating from '$lib/components/ui/product/product-rating.svelte'
	let { productId }: { productId: string } = $props()
</script>

<Rating {productId} />
