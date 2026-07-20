<script lang="ts">
	import { ModeWatcher } from 'mode-watcher'
	import type { Component } from 'svelte'
	let { component, ...props }: { component: Component<any> } & Record<string, unknown> = $props()
	const Comp = $derived(component)
</script>

<ModeWatcher />
<Comp {...props} />
