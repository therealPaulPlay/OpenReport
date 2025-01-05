<script>
	import "../app.css";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();
</script>

{@render children()}

<Toaster />
<ModeWatcher />
