<script lang="ts">
	import * as Faq from '$lib/components/ui/faq'
	import Star from '@lucide/svelte/icons/star'

	let {
		type = 'single',
		useIcon = false,
		iconRotate = 180
	}: { type?: 'single' | 'multiple'; useIcon?: boolean; iconRotate?: number } = $props()

	const items = [
		{ value: 'q1', title: 'Question One', description: '<p>Alpha <strong>Bravo</strong> answer.</p>' },
		{ value: 'q2', title: 'Question Two', description: 'Plain two answer.' }
	]
</script>

<Faq.Root {type}>
	{#each items as item (item.value)}
		<Faq.Item value={item.value}>
			{#if useIcon}
				<Faq.Question {iconRotate}>
					{item.title}
					{#snippet icon()}<Star data-testid="custom-icon" class="size-5" />{/snippet}
				</Faq.Question>
			{:else}
				<Faq.Question {iconRotate}>{item.title}</Faq.Question>
			{/if}
			<Faq.Answer>{@html item.description}</Faq.Answer>
		</Faq.Item>
	{/each}
</Faq.Root>
