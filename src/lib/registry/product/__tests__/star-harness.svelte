<script lang="ts">
	import Star from '../../review/star.svelte'
	let { fill }: { fill: number } = $props()
</script>
<Star {fill} />
