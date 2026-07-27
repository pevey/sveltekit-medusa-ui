<script lang="ts">
	import { cn } from '$lib/utils.js'
	import { getReviewsContext } from './reviews-ctx.svelte.js'
	import Item from './review-item.svelte'
	import type { Snippet } from 'svelte'
	let { class: className = '', children }: { class?: string; children: Snippet } = $props()
	const ctx = getReviewsContext()
</script>

{#if ctx.reviews.length}
	<div class={cn('flex flex-col gap-6', className)} data-review-list role="list">
		{#each ctx.reviews as review (review.id)}
			<Item {review}>{@render children()}</Item>
		{/each}
	</div>
{/if}
