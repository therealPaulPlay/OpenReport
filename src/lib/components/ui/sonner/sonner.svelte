<script>
	import { Toaster } from "svelte-sonner";
	import { mode } from "mode-watcher";

	let { ...restProps } = $props();
</script>

<Toaster
	theme={mode.current}
	class="toaster group"
	style="--normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border);"
	{...restProps}
/>