<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import Form from '$lib/components/ui/product/product-reviews-form.svelte'
	import Author from '$lib/components/ui/product/product-reviews-form-author.svelte'
	import Title from '$lib/components/ui/product/product-reviews-form-title.svelte'
	import Body from '$lib/components/ui/product/product-reviews-form-body.svelte'
	import Rating from '$lib/components/ui/product/product-reviews-form-rating.svelte'
	import Cancel from '$lib/components/ui/product/product-reviews-form-cancel.svelte'
	let { onOpenChange }: { onOpenChange?: (open: boolean) => void } = $props()
</script>

<Root productId="p1" pageSize={10}>
	<Form open={true} {onOpenChange}>
		<Author />
		<Title />
		<Body />
		<Rating />
		<Cancel>Cancel</Cancel>
	</Form>
</Root>
