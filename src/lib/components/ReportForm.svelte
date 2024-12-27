<script>
	import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "$lib/components/ui/card";
	import { Textarea } from "$lib/components/ui/textarea";

	let { reportReasons } = $props();

	let selectedReason = $state(reportReasons[0]);
	let notes = $state("");

	function handleSubmit() {
		// Handle form submission
		console.log("Submitted report:", {
			reason: selectedReason,
			notes,
		});
	}
</script>

<Card class="w-full max-w-md mx-auto">
	<CardHeader>
		<CardTitle>Submit Report</CardTitle>
	</CardHeader>

	<CardContent class="space-y-4">
		<RadioGroup value={selectedReason}>
			{#each reportReasons as reason}
				<div class="flex items-center space-x-2">
					<RadioGroupItem value={reason} id={reason} />
					<label for={reason}>{reason}</label>
				</div>
			{/each}
		</RadioGroup>

		<div class="space-y-2">
			<label for="notes" class="text-sm font-medium">Optional Notes</label>
			<Textarea id="notes" bind:value={notes} placeholder="Add any additional details..." rows="4" />
		</div>
	</CardContent>

	<CardFooter class="flex justify-end gap-2">
		<Button on:click={handleSubmit}>Send</Button>
	</CardFooter>
</Card>
