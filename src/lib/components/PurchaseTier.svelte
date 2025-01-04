<script>
	import { Check } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import { subscriptionTier } from "$lib/stores/accountStore";
	let { title, price, features, comingSoon = false, highlight = false, tier = 1 } = $props();
</script>

<div
	class="p-6 rounded-lg border {highlight
		? 'border-violet-800 border-2'
		: ''} relative"
>
	{#if highlight}
		<div class="p-1 px-2 absolute -top-5 h-5 left-2 bg-violet-800 rounded-t-md flex items-center justify-center">
			<p class="text-white text-xs">Business choice</p>
		</div>
	{/if}
	<h3 class="text-2xl font-semibold mb-4">{title}</h3>
	<p class="text-lg font-bold mb-4">{price}</p>
	<ul class="mb-6 text-muted-foreground">
		{#each features as feature}
			<li class="mb-2 flex items-center justify-center gap-2"><Check size={16} /> {feature}</li>
		{/each}
	</ul>
	{#if comingSoon}
		<p class="text-sm text-primary font-bold mt-8">Coming Soon</p>
	{:else}
		<Button variant="outline" disabled={tier == $subscriptionTier}>{tier == $subscriptionTier ? "Selected" : "Select"}</Button>
	{/if}
</div>
