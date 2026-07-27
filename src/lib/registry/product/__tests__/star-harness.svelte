<script lang="ts">
	import Star from '$lib/components/ui/product/star.svelte'
	let { fill }: { fill: number } = $props()
</script>
<Star {fill} />
