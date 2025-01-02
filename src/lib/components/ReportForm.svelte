<script>
	import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "$lib/components/ui/card";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Check } from "lucide-svelte";
	import { slide } from "svelte/transition";
	import { toast } from "svelte-sonner";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";

	let {
		reportReasons = ["Spam", "Cheating", "Harassment"],
		allowNotes = true,
		requireNotes = false,
		demo = false,
		apiKey,
		link,
		type,
		referenceId,
	} = $props();

	let submitted = $state(false);
	let loading = $state(false);

	let selectedReason = $state(reportReasons[0]);
	let notes = $state("");

	async function handleSubmit() {
		if (loading) return;
		loading = true;

		if (demo) {
			submitted = true;
			loading = false;
			return;
		}

		try {
			await fetchWithErrorHandling("https://api.openreport.dev/report/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					key: apiKey,
					referenceId,
					type: type,
					reason: selectedReason,
					notes: notes || null,
					link: link || null,
				}),
			});

			submitted = true;
		} catch (error) {
			toast.error(error.message);
		} finally {
			loading = false;
		}
	}
</script>

<Card class="w-full max-w-md mx-auto">
	<CardHeader>
		<CardTitle>Submit Report</CardTitle>
	</CardHeader>

	<CardContent class="space-y-4">
		{#if !submitted}
			<RadioGroup value={selectedReason}>
				{#each reportReasons as reason}
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={reason} id={reason} />
						<label for={reason}>{reason}</label>
					</div>
				{/each}
			</RadioGroup>

			{#if allowNotes}
				<div class="space-y-2">
					<label for="notes" class="text-sm font-medium">{requireNotes ? "Notes (required)" : "Optional Notes"}</label>
					<Textarea id="notes" bind:value={notes} placeholder="Add additional details..." rows="4" />
				</div>
				{#if requireNotes && notes.length < 15 && notes.length >= 1}
					<p class="text-sm" transition:slide>Answer too short.</p>
				{/if}
			{/if}

			{#if !demo}
				<p class="text-sm text-muted-foreground">
					By submitting a report, you agree to the <a href="/terms" target="_blank" class=" hover:underline"
						>Terms of Use</a
					>
					and the
					<a href="/privacy" target="_blank" class="hover:underline">Privacy Policy</a>.
				</p>
			{/if}
		{:else}
			<div class="flex justify-center items-center flex-col min-h-32">
				<Check />
				<p>Report submitted!</p>
			</div>
		{/if}
	</CardContent>

	<CardFooter class="flex justify-end gap-2">
		<Button onclick={handleSubmit} disabled={submitted || loading || (requireNotes && notes.length < 15 && allowNotes)}
			>{loading ? "Submitting..." : "Submit"}</Button
		>
	</CardFooter>
</Card>
