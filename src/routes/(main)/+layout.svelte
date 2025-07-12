<script>
	import { subscriptionTier } from "$lib/stores/accountStore";
	import { checkAuthenticationStatus } from "$lib/utils/checkAuthentication";
	import { Sun, Moon } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import { toggleMode } from "mode-watcher";
	import { Goal } from "lucide-svelte";
	import { onMount } from "svelte";
	import { blur } from "svelte/transition";
	let { children } = $props();

	onMount(async () => {
		checkAuthenticationStatus();
	});
</script>

<header class="sticky top-0 flex flex-wrap h-16 items-center gap-4 border-b bg-background px-4 font-medium z-10">
	<nav class="flex gap-6 text-base justify-between items-center w-full">
		<a href="/" class="flex items-center gap-2 text-lg font-semibold">
			<Goal class="h-6 w-6" />
			<span class="max-sm:hidden">OpenReport</span>
			{#if $subscriptionTier > 0}
				<span class="rounded-sm text-sm bg-violet-800 dark:bg-violet-500 px-1 text-white mt-0.25" transition:blur
					>{$subscriptionTier == 1 ? "Plus" : $subscriptionTier == 2 ? "Pro" : "Unknown Tier"}</span
				>
			{/if}
		</a>
		<div class="flex gap-5 items-center">
			<a href="/pricing" class="text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
			<a href="/login" class="text-muted-foreground transition-colors hover:text-foreground">Login</a>
			<Button onclick={toggleMode} variant="outline" size="icon">
				<Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</nav>
</header>
<main class="flex justify-center flex-wrap">
	{@render children()}
</main>