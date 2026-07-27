<script lang="ts">
	import Root from '$lib/components/ui/product/product-reviews.svelte'
	import Form from '$lib/components/ui/product/product-reviews-form.svelte'
	import Submit from '$lib/components/ui/product/product-reviews-form-submit.svelte'
	import ErrorPart from '$lib/components/ui/product/product-reviews-form-error.svelte'
	import List from '$lib/components/ui/product/product-reviews-list.svelte'
	import Review from '$lib/components/ui/product/review.svelte'
	import Author from '$lib/components/ui/product/review-author.svelte'
	let {
		open = true,
		onsuccess,
		onerror,
		onOpenChange
	}: {
		open?: boolean
		onsuccess?: (r: any) => void
		onerror?: (r: any) => void
		onOpenChange?: (o: boolean) => void
	} = $props()
</script>

<Root productId="p1" pageSize={10}>
	<Form bind:open {onsuccess} {onerror} {onOpenChange}>
		<ErrorPart />
		<Submit>Save</Submit>
	</Form>
	<List><Review><Author /></Review></List>
</Root>
