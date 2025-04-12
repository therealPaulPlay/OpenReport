<script>
	import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "$lib/components/ui/card";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Check, Loader2 } from "lucide-svelte";
	import { blur, slide } from "svelte/transition";
	import { toast } from "svelte-sonner";
	import { fetchWithErrorHandling } from "$lib/utils/fetchWithErrorHandling";
	import { renderCaptcha } from "$lib/utils/renderCaptcha";
	import { BASE_API_URL } from "$lib/stores/configStore";

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

	let captchaVisible = $state(false);
	let captchaToken = $state();

	$effect(() => {
		if (captchaVisible) {
			renderCaptcha("#captchaContainer", window.onReportTurnstile);
		}
	});

	if (typeof window !== "undefined") {
		window.onReportTurnstile = async function (token) {
			captchaVisible = false;
			captchaToken = token;

			if (loading) return;
			loading = true;

			try {
				const headers = {
					"Content-Type": "application/json",
					"cf-turnstile-response": captchaToken,
				};

				// Add document.referrer as a custom header if it exists (more reliable than standard "Referer")
				if (document.referrer) headers["x-custom-referrer"] = document.referrer;

				await fetchWithErrorHandling(`${$BASE_API_URL}/report/submit`, {
					method: "POST",
					headers: headers,
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
		};
	}
</script>

<Dialog.Root open={captchaVisible}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Captcha</Dialog.Title>
		</Dialog.Header>
		<div id="captchaContainer" class="min-h-20 flex items-center" transition:blur>
			<!-- Captcha will be loaded here -->
		</div>
	</Dialog.Content>
</Dialog.Root>

<Card class="w-full max-w-md mx-auto">
	<CardHeader>
		{#if !submitted}
			<CardTitle>Report</CardTitle>
		{/if}
	</CardHeader>

	<CardContent class="space-y-4">
		{#if !submitted}
			<RadioGroup bind:value={selectedReason}>
				{#each reportReasons as reason}
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={reason} id={reason} />
						<label for={reason}>{reason}</label>
					</div>
				{/each}
			</RadioGroup>

			{#if allowNotes}
				<div class="space-y-2">
					<label for="notes" class="text-sm font-medium">{requireNotes ? "Notes (required)" : "Notes (optional)"}</label
					>
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
		{#if !submitted}
			<Button
				onclick={() => {
					if (demo) {
						submitted = true;
						loading = false;
						return;
					}
					captchaVisible = true;
				}}
				disabled={loading || (requireNotes && notes.length < 15 && allowNotes)}
			>
				{#if loading}
					<Loader2 class="animate-spin" />
				{/if}
				{loading ? "Submitting..." : "Submit"}</Button
			>
		{/if}
	</CardFooter>
</Card>
