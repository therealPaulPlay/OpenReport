<script>
	import { checkAuthenticationStatus } from "$lib/utils/checkAuthentication";
	import { Goal } from "lucide-svelte";
	import { onMount } from "svelte";
	let { children } = $props();

	onMount(async () => {
		checkAuthenticationStatus();
	});
</script>

<div class="min-h-screen w-full">
	<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 font-medium z-10">
		<nav class="flex gap-6 text-base justify-between items-center w-full">
			<a href="/" class="flex items-center gap-2 text-lg font-semibold">
				<Goal class="h-6 w-6" />
				<span class="bold">OpenReport</span>
			</a>
			<div class="flex gap-5 mr-5">
				<a href="/pricing" class="text-muted-foreground transition-colors hover:text-foreground"> Pricing </a>
				<a href="/dashboard" class="text-muted-foreground transition-colors hover:text-foreground"> Dashboard </a>
				<a href="/login" class="text-muted-foreground transition-colors hover:text-foreground"> Login </a>
			</div>
		</nav>
	</header>
	<main class="flex justify-center flex-wrap">
		{@render children()}
	</main>
</div>
